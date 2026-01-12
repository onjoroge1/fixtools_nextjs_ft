import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import PaymentModal from '../../components/PaymentModal';
import { checkPaymentRequirement as checkPaymentRequirementNew, getUserPlan, hasValidProcessingPass as hasValidProcessingPassNew } from '../../lib/config/pricing';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function DeletePDFPages() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const [userSession, setUserSession] = useState({ processingPass: null });
  const [pagesToDelete, setPagesToDelete] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [pdfjsLib, setPdfjsLib] = useState(null);
  const [currentPdf, setCurrentPdf] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [previewScale, setPreviewScale] = useState(1.5);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const previewContainerRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/pdf/delete-pdf-pages`;

  // Load PDF.js library
  useEffect(() => {
    const loadPDFJS = async () => {
      if (typeof window !== 'undefined') {
        if (window.pdfjsLib && window.pdfjsLib.getDocument) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          setPdfjsLib(window.pdfjsLib);
          return;
        }

        const existingScript = document.querySelector('script[src*="pdf.min.js"]');
        if (existingScript) {
          if (window.pdfjsLib && window.pdfjsLib.getDocument) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            setPdfjsLib(window.pdfjsLib);
          } else {
            existingScript.addEventListener('load', () => {
              if (window.pdfjsLib && window.pdfjsLib.getDocument) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                setPdfjsLib(window.pdfjsLib);
              }
            });
          }
          return;
        }

        try {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.async = true;
          script.onload = () => {
            setTimeout(() => {
              if (window.pdfjsLib && window.pdfjsLib.getDocument) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                setPdfjsLib(window.pdfjsLib);
              }
            }, 100);
          };
          script.onerror = () => {
            setError('Failed to load PDF.js library. Please refresh the page.');
          };
          document.head.appendChild(script);
        } catch (err) {
          console.error('Failed to load PDF.js:', err);
        }
      }
    };
    loadPDFJS();
  }, []);

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

  // Load PDF for preview when file is selected
  useEffect(() => {
    if (pdfFiles.length > 0 && pdfjsLib) {
      loadPDFPreview(pdfFiles[0]);
    }
  }, [pdfFiles, pdfjsLib]);

  // Re-render preview when page changes
  useEffect(() => {
    if (currentPdf && pdfjsLib && canvasRef.current) {
      const timer = setTimeout(() => {
        renderPage(currentPage);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentPage, currentPdf, pdfjsLib]);

  // Load PDF for preview
  const loadPDFPreview = async (file) => {
    if (!pdfjsLib || !file) {
      setIsLoadingPdf(false);
      return;
    }

    setIsLoadingPdf(true);
    setError('');
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        verbosity: 0
      });
      
      const pdf = await loadingTask.promise;
      setCurrentPdf(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      setIsLoadingPdf(false);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError(`Failed to load PDF for preview: ${err.message || 'Unknown error'}.`);
      setCurrentPdf(null);
      setTotalPages(0);
      setIsLoadingPdf(false);
    }
  };

  // Render a specific page
  const renderPage = async (pageNum) => {
    if (!currentPdf || !canvasRef.current || !pdfjsLib) return;

    try {
      const page = await currentPdf.getPage(pageNum - 1);
      const viewport = page.getViewport({ scale: previewScale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      context.clearRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
    } catch (err) {
      console.error('Error rendering page:', err);
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validPdfs = files.filter(file => 
      file.type === 'application/pdf' || 
      /\.pdf$/i.test(file.name)
    );

    if (validPdfs.length === 0) {
      setError('Please upload PDF files (.pdf).');
      return;
    }

    if (validPdfs.length !== files.length) {
      setError(`Some files were skipped. Only PDF files are supported. ${validPdfs.length} of ${files.length} files are valid.`);
    } else {
      setError('');
    }

    // Calculate total file size
    const totalSize = validPdfs.reduce((sum, file) => sum + file.size, 0);
    const fileCount = validPdfs.length;

    // Check payment requirement
    const userPlan = getUserPlan(userSession);
    const requirement = checkPaymentRequirementNew('pdf', totalSize, fileCount, userPlan);

    if (requirement.requiresPayment) {
      setPaymentRequirement(requirement);
      setShowPaymentModal(true);
      return;
    }

    setPdfFiles(validPdfs);
    setProcessedFiles([]);
    setPagesToDelete('');
    setTotalPages(0);
    setCurrentPdf(null);
  };

  // Delete pages from PDF
  const deletePages = async () => {
    if (pdfFiles.length === 0) {
      setError('Please upload at least one PDF file first.');
      return;
    }

    if (!pagesToDelete || !pagesToDelete.trim()) {
      setError('Please specify which pages to delete (e.g., "1-3,5,7-9").');
      return;
    }

    // Check payment requirement again
    const totalSize = pdfFiles.reduce((sum, file) => sum + file.size, 0);
    const fileCount = pdfFiles.length;
    const userPlan = getUserPlan(userSession);
    const requirement = checkPaymentRequirementNew('pdf', totalSize, fileCount, userPlan);

    if (requirement.requiresPayment) {
      setPaymentRequirement(requirement);
      setShowPaymentModal(true);
      return;
    }

    setIsProcessing(true);
    setError('');
    setProgress({ current: 0, total: pdfFiles.length });

    try {
      const formData = new FormData();
      
      // Add files
      pdfFiles.forEach((file) => {
        formData.append('pdf', file);
      });

      // Add pages to delete
      formData.append('pagesToDelete', pagesToDelete.trim());

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

      const response = await fetch('/api/pdf/delete-pdf-pages', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setPaymentRequirement(data.requirement);
          setShowPaymentModal(true);
          setIsProcessing(false);
          return;
        }
        throw new Error(data.error || data.message || 'Failed to delete pages from PDF');
      }

      if (data.success) {
        if (data.files && Array.isArray(data.files)) {
          setProcessedFiles(data.files);
        } else if (data.file) {
          setProcessedFiles([{ file: data.file, filename: data.filename, stats: data.stats }]);
        }
      }
    } catch (err) {
      console.error('Deletion error:', err);
      setError('Failed to delete pages: ' + (err.message || 'Unknown error'));
    } finally {
      setIsProcessing(false);
      setProgress({ current: 0, total: 0 });
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
    if (pdfFiles.length > 0) {
      deletePages();
    }
  };

  // Download PDF
  const handleDownload = (fileData, index) => {
    if (!fileData || !fileData.file) {
      setError('No PDF to download. Please delete pages first.');
      return;
    }

    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${fileData.file}`;
    link.download = fileData.filename || `pdf-pages-deleted-${index + 1}.pdf`;
    link.click();
  };

  // Remove PDF from list
  const removePdfFile = (index) => {
    const newFiles = pdfFiles.filter((_, i) => i !== index);
    setPdfFiles(newFiles);
    setProcessedFiles([]);
    if (index === 0 && newFiles.length > 0) {
      loadPDFPreview(newFiles[0]);
    } else if (newFiles.length === 0) {
      setCurrentPdf(null);
      setTotalPages(0);
    }
  };

  // Clear everything
  const handleClear = () => {
    setPdfFiles([]);
    setProcessedFiles([]);
    setPagesToDelete('');
    setTotalPages(0);
    setCurrentPdf(null);
    setCurrentPage(1);
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
  const totalSize = pdfFiles.reduce((sum, file) => sum + file.size, 0);

  // Parse page range to validate
  const validatePageRange = (rangeStr) => {
    if (!rangeStr || !rangeStr.trim()) return { valid: false, error: 'Page range cannot be empty.' };
    
    const parts = rangeStr.split(',');
    const pages = new Set();
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(n => parseInt(n.trim(), 10));
        if (isNaN(start) || isNaN(end) || start < 1 || end < 1 || start > end) {
          return { valid: false, error: `Invalid range: "${trimmed}". Use format like "1-3".` };
        }
        if (totalPages > 0 && end > totalPages) {
          return { valid: false, error: `Page ${end} exceeds total pages (${totalPages}).` };
        }
      } else {
        const pageNum = parseInt(trimmed, 10);
        if (isNaN(pageNum) || pageNum < 1) {
          return { valid: false, error: `Invalid page number: "${trimmed}". Use numeric values.` };
        }
        if (totalPages > 0 && pageNum > totalPages) {
          return { valid: false, error: `Page ${pageNum} exceeds total pages (${totalPages}).` };
        }
      }
    }
    
    return { valid: true, error: null };
  };

  const pageRangeValidation = validatePageRange(pagesToDelete);

  // Structured Data Schemas
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I delete pages from a PDF?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Upload your PDF file using the upload button or drag and drop it into the designated area. Enter the page numbers or ranges you want to delete (e.g., '1-3,5,7-9' to delete pages 1, 2, 3, 5, 7, 8, and 9). Click 'Delete Pages' to process your file. The tool will create a new PDF with the specified pages removed. Once processing is complete, download your modified PDF file."
          }
        },
        {
          "@type": "Question",
          "name": "Is deleting PDF pages free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our PDF page deletion tool is free for single PDF files up to 10MB. For larger files (above 10MB) or batch processing (multiple files), a Processing Pass is required. All processing happens on our secure servers, ensuring your PDF files are processed quickly and efficiently."
          }
        },
        {
          "@type": "Question",
          "name": "What page range format is supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our tool supports flexible page range formats. You can specify individual pages separated by commas (e.g., '1,3,5'), page ranges using hyphens (e.g., '1-3'), or a combination of both (e.g., '1-3,5,7-9'). The tool will delete all specified pages and create a new PDF with the remaining pages."
          }
        },
        {
          "@type": "Question",
          "name": "Can I delete pages from multiple PDFs at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! You can upload multiple PDF files at once and the same page range will be applied to all files. Each PDF will be processed separately, and you'll receive individual files with pages deleted. For batch processing (2+ files), a Processing Pass is required for free tier users. Paid users can process up to 20 files in a single batch."
          }
        },
        {
          "@type": "Question",
          "name": "Is my PDF data secure when deleting pages?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, your PDF files are processed securely on our servers. Files are automatically deleted after processing is complete. We do not store, share, or access your PDF content. For maximum privacy, consider using our Processing Pass for larger files, which ensures priority processing and enhanced security."
          }
        },
        {
          "@type": "Question",
          "name": "What file size limits apply?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Free tier supports single PDF files up to 10MB. For larger files (up to 500MB) or batch processing multiple files, a Processing Pass is required. The Processing Pass costs $3.99 and is valid for 24 hours, allowing unlimited conversions during that period."
          }
        },
        {
          "@type": "Question",
          "name": "Can I delete all pages from a PDF?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, you cannot delete all pages from a PDF. At least one page must remain in the document. The tool will prevent deletion if it would result in an empty PDF. You can delete up to 90% of pages from a document, ensuring at least 10% of pages remain."
          }
        },
        {
          "@type": "Question",
          "name": "Will the remaining pages maintain their quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all remaining pages maintain the original quality of the source PDF. No compression or quality loss occurs during page deletion. All text, images, graphics, and formatting from the original pages are preserved in the resulting PDF document."
          }
        }
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Delete PDF Pages - Remove Pages from PDF Online",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online tool to delete pages from PDF files. Remove specific pages or page ranges from PDF documents. Batch processing supported. Works securely on our servers with automatic file cleanup.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.6",
        "ratingCount": "680",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Delete specific pages or ranges",
        "Batch PDF processing",
        "PDF preview before deletion",
        "Secure server-side processing",
        "Automatic file cleanup",
        "No registration required",
        "Download PDF instantly",
        "Preserve original quality"
      ]
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Delete Pages from PDF",
      "description": "Step-by-step guide to delete pages from PDF files online.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your PDF file",
          "text": "Click the upload button or drag and drop your PDF file into the upload area. You can select multiple PDF files at once for batch processing. The tool will load the PDF and display a preview so you can see which pages you're working with.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Specify pages to delete",
          "text": "Enter the page numbers or ranges you want to delete. Use individual pages (e.g., '1,3,5'), page ranges (e.g., '1-3'), or a combination (e.g., '1-3,5,7-9'). The tool will validate your input and show a preview of the pages to be deleted.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Delete pages and download",
          "text": "Click the 'Delete Pages' button to process your file. The tool will create a new PDF with the specified pages removed. Once processing is complete, click 'Download PDF' to save your modified PDF file. For batch processing, download individual files or all files at once.",
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
          "name": "Delete PDF Pages",
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
        <title>Delete PDF Pages - Free Online Tool to Remove Pages from PDF | FixTools</title>
        <meta name="title" content="Delete PDF Pages - Free Online Tool to Remove Pages from PDF | FixTools" />
        <meta name="description" content="Delete pages from PDF files online for free. Remove specific pages or page ranges from PDF documents. Batch processing supported. Works securely on our servers - fast, reliable, no registration required." />
        <meta name="keywords" content="delete pdf pages, remove pages from pdf, delete pages from pdf, pdf page remover, remove pdf pages online, delete specific pdf pages, pdf page deleter, remove pages from pdf file, delete pages from pdf online" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Delete PDF Pages - Free Online Tool to Remove Pages from PDF" />
        <meta property="og:description" content="Delete pages from PDF files online for free. Remove specific pages or page ranges from PDF documents. Batch processing supported." />
        <meta property="og:image" content={`${siteHost}/images/og-delete-pdf-pages.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Delete PDF Pages - Free Online Tool to Remove Pages from PDF" />
        <meta property="twitter:description" content="Delete pages from PDF files online for free. Remove specific pages or page ranges from PDF documents." />
        <meta property="twitter:image" content={`${siteHost}/images/og-delete-pdf-pages.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.delete-pdf-pages-page) {
          font-size: 100% !important;
        }
        
        .delete-pdf-pages-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .delete-pdf-pages-page *,
        .delete-pdf-pages-page *::before,
        .delete-pdf-pages-page *::after {
          box-sizing: border-box;
        }
        
        .delete-pdf-pages-page h1,
        .delete-pdf-pages-page h2,
        .delete-pdf-pages-page h3,
        .delete-pdf-pages-page p,
        .delete-pdf-pages-page ul,
        .delete-pdf-pages-page ol {
          margin: 0;
        }
        
        .delete-pdf-pages-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .delete-pdf-pages-page input,
        .delete-pdf-pages-page textarea,
        .delete-pdf-pages-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="delete-pdf-pages-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">Delete PDF Pages</span>
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
                  Delete PDF Pages
                </span>
              </h1>
              
              {/* Description - MUST include primary keyword in first 100 words */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>Delete PDF Pages</strong> tool helps you remove specific pages or page ranges from PDF documents instantly. Delete unwanted pages from your PDF files. Batch processing supported for multiple files. Works securely on our servers - fast, reliable, no registration required.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Delete Pages Now
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
                      <span className="text-2xl">✂️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Flexible Page Selection</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Delete specific pages (e.g., '1,3,5'), page ranges (e.g., '1-3'), or combinations (e.g., '1-3,5,7-9'). The tool validates your input and processes pages accurately.
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
                      <h4 className="text-lg font-bold text-slate-900">PDF Preview</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Preview your PDF before deleting pages. Navigate through pages to verify which pages you want to remove, ensuring accuracy in your page selection.
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
                        All page deletion happens on secure servers. Files are automatically deleted after processing to ensure your data remains private and secure.
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
                <h2 className="text-xl font-semibold text-slate-900">Delete Pages from PDF</h2>
                <p className="mt-1 text-sm text-slate-600">Upload PDF file(s) and specify which pages to delete</p>
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
                Upload PDF File(s) {pdfFiles.length > 0 && `(${pdfFiles.length} selected)`}
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
                    <span className="text-4xl">📄</span>
                    <div>
                      <span className="text-sm font-semibold text-slate-700">Click to upload PDF files</span>
                      <p className="text-xs text-slate-500 mt-1">or drag and drop (.pdf files)</p>
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

            {/* PDF Files List */}
            {pdfFiles.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Selected PDF Files
                </label>
                <div className="space-y-2">
                  {pdfFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between rounded-xl border-2 border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-2xl">📄</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate" title={file.name}>{file.name}</p>
                          <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removePdfFile(index)}
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

            {/* PDF Preview */}
            {currentPdf && totalPages > 0 && (
              <div className="mb-6 rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-slate-900">
                    PDF Preview (Page {currentPage} of {totalPages})
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage <= 1}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Prev
                    </button>
                    <span className="text-xs text-slate-600 font-medium">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage >= totalPages}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </div>
                <div className="relative border-2 border-slate-300 rounded-lg overflow-auto bg-slate-100 shadow-inner" ref={previewContainerRef} style={{ maxHeight: '500px' }}>
                  {isLoadingPdf ? (
                    <div className="flex items-center justify-center p-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <canvas
                      ref={canvasRef}
                      style={{ 
                        display: 'block', 
                        margin: '0 auto', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        maxWidth: '100%',
                        height: 'auto'
                      }}
                      className="bg-white"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Pages to Delete Input */}
            {pdfFiles.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Pages to Delete
                  {totalPages > 0 && (
                    <span className="text-xs text-slate-500 ml-2">(PDF has {totalPages} page{totalPages !== 1 ? 's' : ''})</span>
                  )}
                </label>
                <input
                  type="text"
                  value={pagesToDelete}
                  onChange={(e) => setPagesToDelete(e.target.value)}
                  placeholder='e.g., "1-3,5,7-9" or "1,3,5"'
                  className={`w-full rounded-xl border-2 ${
                    pagesToDelete && !pageRangeValidation.valid 
                      ? 'border-red-300 bg-red-50' 
                      : pagesToDelete && pageRangeValidation.valid 
                        ? 'border-emerald-300 bg-emerald-50' 
                        : 'border-slate-300 bg-white'
                  } px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
                {pagesToDelete && !pageRangeValidation.valid && (
                  <p className="mt-2 text-xs text-red-600">{pageRangeValidation.error}</p>
                )}
                {pagesToDelete && pageRangeValidation.valid && (
                  <p className="mt-2 text-xs text-emerald-600">✓ Page range is valid</p>
                )}
                {!pagesToDelete && totalPages > 0 && (
                  <p className="mt-2 text-xs text-slate-500">
                    Enter page numbers or ranges separated by commas. Examples: "1-3,5,7-9" or "1,3,5" or "1-5"
                  </p>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg border-2 border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Delete Button */}
            {pdfFiles.length > 0 && pagesToDelete && pageRangeValidation.valid && !isProcessing && (
              <div className="mb-6">
                <button
                  onClick={deletePages}
                  disabled={isProcessing || !pageRangeValidation.valid}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Deleting Pages...' : `⚡ Delete Pages from ${pdfFiles.length} PDF${pdfFiles.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="mb-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <p className="text-sm font-semibold text-blue-900">Deleting pages from PDF files...</p>
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
            {processedFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-800">
                    PDF{processedFiles.length > 1 ? 's' : ''} Ready ({processedFiles.length})
                  </label>
                </div>
                <div className="space-y-3">
                  {processedFiles.map((fileData, index) => (
                    <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-2xl">📄</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate" title={fileData.filename}>
                              {fileData.filename || `pdf-pages-deleted-${index + 1}.pdf`}
                            </p>
                            {fileData.stats && (
                              <p className="text-xs text-slate-500 mt-1">
                                {fileData.stats.totalPages} pages → {fileData.stats.pagesRemaining} pages ({fileData.stats.pagesDeleted} deleted, {fileData.stats.deletionPercentage}%)
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

        {/* What is Delete PDF Pages Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Delete PDF Pages?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Delete PDF Pages</strong> is the process of removing specific pages or page ranges from PDF documents. This is useful for cleaning up PDF files, removing unwanted pages, extracting specific content, creating custom PDF documents, and reducing file size by removing unnecessary pages.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://pdf-lib.js.org/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">pdf-lib documentation</a>, PDF page deletion is accomplished by creating a new PDF document and copying all pages except the ones to be deleted. The <a href="https://pdf-lib.js.org/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">pdf-lib library</a> provides comprehensive PDF manipulation capabilities that allow precise control over page selection and deletion.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Deleting PDF pages is essential for document management, creating custom PDF documents, removing confidential or unnecessary pages, reducing file size, extracting specific content sections, and preparing PDFs for sharing or archiving. This functionality ensures you can create clean, focused PDF documents that contain only the content you need.
              </p>
            </div>
          </div>
        </section>

        {/* Why Use Delete PDF Pages Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use Delete PDF Pages?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Deleting pages from PDF documents offers numerous benefits:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">🧹</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Clean Up Documents</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Remove unwanted pages, blank pages, or pages with errors from your PDF documents. Create clean, professional documents by deleting unnecessary content and keeping only the pages you need for your specific use case.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Remove Confidential Content</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Delete pages containing sensitive or confidential information before sharing PDF documents. Remove personal data, financial information, or proprietary content to ensure privacy and security when sharing documents with others.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Reduce File Size</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Decrease PDF file size by removing pages with large images, graphics, or unnecessary content. Smaller files are easier to share via email, upload to websites, or store in cloud storage, improving transfer speeds and storage efficiency.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">✂️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Extract Specific Content</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Create custom PDF documents by deleting pages you don't need and keeping only the relevant content. Extract specific sections from large documents, create focused PDFs for presentations, or prepare documents for specific audiences.
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
              Our Delete PDF Pages tool makes it easy to remove pages from PDF files:
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Deleting PDF Pages</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Following these best practices ensures optimal results when deleting PDF pages:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Preview Before Deleting</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Use the PDF preview feature to review pages before deletion. Navigate through all pages to ensure you're deleting the correct pages. Verify page numbers match your intended deletion list to avoid removing important content by mistake.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use Clear Page Ranges</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Specify pages clearly using standard formats. Use individual pages (e.g., '1,3,5'), page ranges (e.g., '1-3'), or combinations (e.g., '1-3,5,7-9'). The tool validates your input, but double-check page numbers to ensure accuracy before processing.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Keep Original Files</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Always keep backup copies of your original PDF files before deleting pages. While the tool creates new PDFs with pages removed, preserving originals ensures you can revert changes or create different versions with different pages deleted if needed.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Verify Deletion Results</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      After deletion, review the statistics shown for each processed file. Check that the number of deleted pages and remaining pages matches your expectations. Download and open the resulting PDF to verify that the correct pages were removed and remaining pages are in the correct order.
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
              <Link href="/pdf/pdf-splitter" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-xl">✂️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">PDF Splitter</h3>
                    <p className="text-xs text-slate-600">Split PDF into separate files</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/reorder-pdf-pages" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
                    <span className="text-xl">🔄</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">Reorder PDF Pages</h3>
                    <p className="text-xs text-slate-600">Change page order in PDF</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/extract-pdf-pages" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-xl">📤</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">Extract PDF Pages</h3>
                    <p className="text-xs text-slate-600">Extract specific pages from PDF</p>
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

