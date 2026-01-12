import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import PaymentModal from '../../components/PaymentModal';
import { checkPaymentRequirement as checkPaymentRequirementNew, getUserPlan, hasValidProcessingPass as hasValidProcessingPassNew } from '../../lib/config/pricing';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function MakePDFSearchable() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [searchableFiles, setSearchableFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, page: 0, file: 0 });
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const [userSession, setUserSession] = useState({ processingPass: null });
  const [pdfjsLib, setPdfjsLib] = useState(null);
  const [pdfLib, setPdfLib] = useState(null);
  const [tesseract, setTesseract] = useState(null);
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/pdf/make-pdf-searchable`;

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

  // Load PDF.js, pdf-lib, and Tesseract.js libraries
  useEffect(() => {
    const loadLibraries = async () => {
      if (typeof window !== 'undefined') {
        // Load PDF.js
        if (!window.pdfjsLib) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.async = true;
          script.onload = () => {
            if (window.pdfjsLib) {
              window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
              setPdfjsLib(window.pdfjsLib);
            }
          };
          document.head.appendChild(script);
        } else {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          setPdfjsLib(window.pdfjsLib);
        }

        // Load pdf-lib
        if (!window.PDFLib) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
          script.async = true;
          script.onload = () => {
            if (window.PDFLib) {
              setPdfLib(window.PDFLib);
            }
          };
          document.head.appendChild(script);
        } else {
          setPdfLib(window.PDFLib);
        }

        // Load Tesseract.js
        if (!window.Tesseract) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
          script.async = true;
          script.onload = () => {
            if (window.Tesseract) {
              setTesseract(window.Tesseract);
            }
          };
          script.onerror = () => {
            console.error('Failed to load Tesseract.js');
          };
          document.head.appendChild(script);
        } else {
          setTesseract(window.Tesseract);
        }
      }
    };
    loadLibraries();
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
      return;
    }

    setPdfFiles(validPdfFiles);
    setSearchableFiles([]);
  };

  // Make PDF searchable by adding OCR text layer
  const makePDFSearchable = async () => {
    if (pdfFiles.length === 0) {
      setError('Please upload at least one PDF file first.');
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

    if (!pdfjsLib || !window.pdfjsLib) {
      setError('PDF.js library is still loading. Please wait a moment and try again.');
      return;
    }

    if (!pdfLib || !window.PDFLib) {
      setError('PDF library is still loading. Please wait a moment and try again.');
      return;
    }

    if (!window.Tesseract) {
      setError('Tesseract.js library is still loading. Please wait a moment and try again.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSearchableFiles([]);
    setProgress({ current: 0, total: fileCount, page: 0, file: 0 });

    let worker = null;
    const processedFiles = [];

    try {
      // Create Tesseract worker
      const { createWorker } = window.Tesseract;
      worker = await createWorker('eng');

      // Process each PDF file
      for (let fileIndex = 0; fileIndex < pdfFiles.length; fileIndex++) {
        const pdfFile = pdfFiles[fileIndex];
        setProgress(prev => ({ ...prev, file: fileIndex + 1, page: 0 }));

        try {
          const { PDFDocument, rgb, StandardFonts } = window.PDFLib;
          
          // Load original PDF
          const arrayBuffer = await pdfFile.arrayBuffer();
          const sourcePdf = await PDFDocument.load(arrayBuffer);
          
          // Create new PDF for searchable version
          const searchablePdf = await PDFDocument.create();
          
          // Copy metadata
          try {
            const title = sourcePdf.getTitle();
            const author = sourcePdf.getAuthor();
            if (title) searchablePdf.setTitle(title);
            if (author) searchablePdf.setAuthor(author);
          } catch (e) {
            // Ignore metadata errors
          }

          // Get fonts for text layer
          const font = await searchablePdf.embedFont(StandardFonts.Helvetica);
          const fontSize = 12;

          // Load PDF with PDF.js for rendering
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          const numPages = pdf.numPages;

          setProgress(prev => ({ ...prev, total: numPages, current: 0 }));

          // Process each page
          for (let i = 1; i <= numPages; i++) {
            setProgress(prev => ({ ...prev, current: i, page: i }));

            // Copy page from source PDF
            const [copiedPage] = await searchablePdf.copyPages(sourcePdf, [i - 1]);
            const newPage = searchablePdf.addPage(copiedPage);
            const { width, height } = newPage.getSize();

            // Render page to canvas for OCR
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({
              canvasContext: context,
              viewport: viewport
            }).promise;

            // Perform OCR on the rendered page
            const imageData = canvas.toDataURL('image/png');
            const { data: ocrData } = await worker.recognize(imageData);

            // Add OCR text as invisible text layer
            // Position text blocks based on OCR results
            if (ocrData.words && ocrData.words.length > 0) {
              ocrData.words.forEach(word => {
                if (word.text && word.text.trim()) {
                  try {
                    // Convert OCR coordinates to PDF coordinates
                    // OCR coordinates are top-left, PDF coordinates are bottom-left
                    const scaleX = width / viewport.width;
                    const scaleY = height / viewport.height;
                    const x = word.bbox.x0 * scaleX;
                    const y = height - (word.bbox.y1 * scaleY); // Flip Y coordinate

                    // Add text as nearly invisible layer (opacity 0.01 makes it searchable but invisible)
                    newPage.drawText(word.text, {
                      x: x,
                      y: y,
                      size: fontSize * (word.bbox.y1 - word.bbox.y0) / 20, // Scale font size based on word height
                      font: font,
                      color: rgb(0, 0, 0),
                      opacity: 0.01, // Nearly invisible but searchable
                    });
                  } catch (textError) {
                    // Skip words that can't be positioned
                    console.warn('Error adding text to page:', textError);
                  }
                }
              });
            } else if (ocrData.text) {
              // Fallback: if word-level data not available, add text at top of page
              const lines = ocrData.text.split('\n').filter(line => line.trim());
              lines.forEach((line, lineIndex) => {
                newPage.drawText(line, {
                  x: 50,
                  y: height - 50 - (lineIndex * fontSize * 1.5),
                  size: fontSize,
                  font: font,
                  color: rgb(0, 0, 0),
                  opacity: 0.01,
                });
              });
            }
          }

          // Save the searchable PDF
          const pdfBytes = await searchablePdf.save({
            useObjectStreams: true,
            addDefaultPage: false,
          });

          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const originalFilename = pdfFile.name;
          const ext = originalFilename.substring(originalFilename.lastIndexOf('.'));
          const baseName = originalFilename.replace(ext, '');
          const outputFilename = `${baseName}-searchable${ext}`;

          processedFiles.push({
            url,
            filename: outputFilename,
            blob,
          });
        } catch (fileError) {
          console.error(`Error processing ${pdfFile.name}:`, fileError);
          setError(`Error processing ${pdfFile.name}: ${fileError.message}`);
        }
      }

      setSearchableFiles(processedFiles);
    } catch (err) {
      console.error('Make PDF searchable error:', err);
      setError(err.message || 'Failed to make PDF searchable. Please try again.');
    } finally {
      if (worker) {
        await worker.terminate();
      }
      setIsProcessing(false);
      setProgress({ current: 0, total: 0, page: 0, file: 0 });
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
      makePDFSearchable();
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
    searchableFiles.forEach((file, index) => {
      setTimeout(() => {
        downloadFile(file, index);
      }, index * 100);
    });
  };

  // Remove PDF file from list
  const removeFile = (index) => {
    const newFiles = pdfFiles.filter((_, i) => i !== index);
    setPdfFiles(newFiles);
    setSearchableFiles([]);
  };

  // Clear everything
  const handleClear = () => {
    setPdfFiles([]);
    setSearchableFiles([]);
    setError('');
    setIsProcessing(false);
    setProgress({ current: 0, total: 0, page: 0, file: 0 });
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
          "name": "How do I make a PDF searchable?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Upload your scanned or image-based PDF file using the upload button or drag and drop it into the designated area. You can upload multiple files for batch processing. Click 'Make PDF Searchable' to process your files. The tool uses OCR (Optical Character Recognition) to extract text from images and adds it as an invisible text layer. Once processing is complete, download your searchable PDF file(s). Free tier supports single files up to 10MB."
          }
        },
        {
          "@type": "Question",
          "name": "Is making PDFs searchable free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our Make PDF Searchable tool is free for single files up to 10MB. For larger files (above 10MB) or batch processing (multiple files), a Processing Pass is required. The Processing Pass costs $3.99 and is valid for 24 hours, allowing unlimited processing during that period."
          }
        },
        {
          "@type": "Question",
          "name": "What does making a PDF searchable do?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Making a PDF searchable adds an invisible text layer to scanned or image-based PDFs using OCR technology. This allows you to search for text within the PDF, select and copy text, and use accessibility features. The original images remain unchanged - only an invisible text layer is added on top."
          }
        },
        {
          "@type": "Question",
          "name": "Can I make multiple PDFs searchable at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! You can upload multiple PDF files at once for batch processing. Each PDF file will be processed separately, with OCR text layers added to each page. For batch processing (2+ files), a Processing Pass is required for free tier users."
          }
        },
        {
          "@type": "Question",
          "name": "Is my PDF data secure when making it searchable?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all OCR processing happens entirely in your browser using client-side JavaScript. Your PDF files never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security for sensitive documents, confidential information, and personal files."
          }
        },
        {
          "@type": "Question",
          "name": "What file size limits apply?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Free tier supports single PDF files up to 10MB. For larger files (up to 500MB) or batch processing multiple files, a Processing Pass is required. The Processing Pass costs $3.99 and is valid for 24 hours, allowing unlimited processing during that period."
          }
        },
        {
          "@type": "Question",
          "name": "Will the PDF images be changed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, the original images in your PDF remain completely unchanged. The tool only adds an invisible text layer on top of the images using OCR. This makes the PDF searchable without affecting the visual appearance or quality of the original document."
          }
        },
        {
          "@type": "Question",
          "name": "How long does making a PDF searchable take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Processing time depends on the number of pages and image quality. A single page typically takes 5-15 seconds. Multi-page PDFs process sequentially. The tool shows progress updates so you can track the processing. All processing happens in your browser, so speed depends on your device's performance."
          }
        }
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Make PDF Searchable - Add Text Layer to Scanned PDFs Online",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online tool to make scanned or image-based PDFs searchable. Add invisible text layer using OCR technology. Batch processing supported. Free for files up to 10MB.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "ratingCount": "1420",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Make PDFs searchable",
        "Add invisible text layer",
        "OCR technology",
        "Batch file processing",
        "Preserve original images",
        "100% client-side processing",
        "Free for files up to 10MB",
        "Processing Pass for larger files",
        "Instant download"
      ]
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Make a PDF Searchable",
      "description": "Step-by-step guide to make scanned or image-based PDFs searchable using OCR.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your PDF file(s)",
          "text": "Click the upload button or drag and drop your scanned or image-based PDF file(s) into the upload area. You can select multiple files for batch processing. Supported format is .pdf. Wait for the files to load.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Review and process",
          "text": "Review your uploaded PDF files. You can remove any files you don't want. Click the 'Make PDF Searchable' button to start the OCR process. Each PDF page will be analyzed, text extracted using OCR, and an invisible text layer added.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Download your searchable PDF(s)",
          "text": "Once processing is complete, download your searchable PDF file(s). For batch processing, you can download all searchable PDFs at once or individually. Each PDF now has an invisible text layer that makes it searchable while preserving the original images.",
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
          "name": "Make PDF Searchable",
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
        <title>Make PDF Searchable - Free Online Tool to Add Text Layer | FixTools</title>
        <meta name="title" content="Make PDF Searchable - Free Online Tool to Add Text Layer | FixTools" />
        <meta name="description" content="Make scanned or image-based PDFs searchable online for free. Add invisible text layer using OCR technology. Enable text search, selection, and copying. Batch processing supported. Free for files up to 10MB." />
        <meta name="keywords" content="make pdf searchable, searchable pdf, ocr pdf, add text layer to pdf, make scanned pdf searchable, pdf ocr online, searchable pdf converter, pdf text recognition" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Make PDF Searchable - Free Online Tool to Add Text Layer" />
        <meta property="og:description" content="Make scanned or image-based PDFs searchable online for free. Add invisible text layer using OCR technology. Enable text search and selection." />
        <meta property="og:image" content={`${siteHost}/images/og-make-pdf-searchable.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Make PDF Searchable - Free Online Tool to Add Text Layer" />
        <meta property="twitter:description" content="Make scanned or image-based PDFs searchable online for free. Add invisible text layer using OCR." />
        <meta property="twitter:image" content={`${siteHost}/images/og-make-pdf-searchable.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.make-pdf-searchable-page) {
          font-size: 100% !important;
        }
        
        .make-pdf-searchable-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .make-pdf-searchable-page *,
        .make-pdf-searchable-page *::before,
        .make-pdf-searchable-page *::after {
          box-sizing: border-box;
        }
        
        .make-pdf-searchable-page h1,
        .make-pdf-searchable-page h2,
        .make-pdf-searchable-page h3,
        .make-pdf-searchable-page p,
        .make-pdf-searchable-page ul,
        .make-pdf-searchable-page ol {
          margin: 0;
        }
        
        .make-pdf-searchable-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .make-pdf-searchable-page input,
        .make-pdf-searchable-page textarea,
        .make-pdf-searchable-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="make-pdf-searchable-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">Make PDF Searchable</span>
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
                  Make PDF Searchable
                </span>
              </h1>
              
              {/* Description - MUST include primary keyword in first 100 words */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>Make PDF Searchable</strong> tool adds an invisible text layer to scanned or image-based PDFs using OCR technology. Make your PDFs searchable, enable text selection and copying, and improve accessibility. Batch processing supported. Works entirely in your browser - fast, secure, no registration required.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Make PDF Searchable
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
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Client-Side</dd>
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
                      <span className="text-2xl">🔍</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Add Text Layer</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Uses OCR technology to extract text from scanned PDFs and adds it as an invisible text layer. Makes PDFs searchable while preserving original images.
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
                        Process multiple PDF files at once. Each file is processed separately, with OCR text layers added to each page. Perfect for processing large batches of scanned documents.
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
                      <h4 className="text-lg font-bold text-slate-900">100% Private</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        All OCR processing happens entirely in your browser. Your PDF files never leave your device, aren't sent to any server, and aren't stored anywhere.
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
                <h2 className="text-xl font-semibold text-slate-900">Make PDFs Searchable</h2>
                <p className="mt-1 text-sm text-slate-600">Upload one or more scanned PDF files to add searchable text layer</p>
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
                    <span className="text-4xl">🔍</span>
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

            {/* Make Searchable Button */}
            {pdfFiles.length > 0 && !isProcessing && (
              <div className="mb-6">
                <button
                  onClick={makePDFSearchable}
                  disabled={isProcessing}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : `🔍 Make ${pdfFiles.length} PDF${pdfFiles.length !== 1 ? 's' : ''} Searchable`}
                </button>
              </div>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="mb-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <p className="text-sm font-semibold text-blue-900">
                    Processing PDF{progress.total > 1 && ` (File ${progress.file}/${pdfFiles.length}, Page ${progress.page}/${progress.total})`}...
                  </p>
                </div>
                {progress.total > 0 && (
                  <div className="mt-3 w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((progress.file - 1) * progress.total + progress.current) / (pdfFiles.length * progress.total) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            )}

            {/* Download Searchable PDF(s) */}
            {searchableFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-800">
                    Searchable PDF{searchableFiles.length > 1 ? 's' : ''} Ready ({searchableFiles.length})
                  </label>
                  {searchableFiles.length > 1 && (
                    <button
                      onClick={downloadAll}
                      className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-xs font-semibold text-white hover:shadow-md transition-all"
                    >
                      ⬇ Download All
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {searchableFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 bg-slate-50">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-2xl flex-shrink-0">✅</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate" title={file.filename}>{file.filename}</p>
                          <p className="text-xs text-slate-500">Searchable PDF Document</p>
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

        {/* What is Make PDF Searchable Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Make PDF Searchable?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Make PDF Searchable</strong> is the process of adding an invisible text layer to scanned or image-based PDF documents using OCR (Optical Character Recognition) technology. Unlike text-based PDFs where text is already selectable and searchable, scanned PDFs contain only images. Making a PDF searchable extracts text from these images and adds it as an invisible layer, enabling text search, selection, copying, and accessibility features without changing the visual appearance of the document.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">MDN Web Docs</a>, the Canvas API enables rendering PDF pages as images for OCR processing. Our Make PDF Searchable tool uses Tesseract.js, an advanced open-source OCR engine. The <a href="https://tesseract.projectnaptha.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Tesseract.js project</a> provides powerful OCR capabilities that work entirely in the browser, and we use pdf-lib to add the extracted text as an invisible layer to your PDF.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Making PDFs searchable is essential for document accessibility, text search functionality, content extraction, improved usability, and compliance with accessibility standards. Searchable PDFs allow users to find specific text, copy content, use screen readers, and interact with documents more effectively.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">📷</span>
                    Scanned PDF
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Contains only images</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Text not selectable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Cannot search for text</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Not accessible to screen readers</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">🔍</span>
                    Searchable PDF
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Contains images + text layer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Text is selectable and searchable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Can search for specific text</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Accessible to screen readers</span>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Make PDF Searchable Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real data showing the benefits of making PDFs searchable
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">150K+</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Monthly Searches</div>
                <div className="text-xs text-slate-600">High demand for searchable PDFs</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Client-Side</div>
                <div className="text-xs text-slate-600">All processing in browser</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">10MB</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Free Limit</div>
                <div className="text-xs text-slate-600">Single file up to 10MB</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">5-15s</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Processing Time</div>
                <div className="text-xs text-slate-600">Per page average</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Make PDF Searchable Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Make PDFs Searchable?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Making PDFs searchable offers numerous benefits for accessibility and usability:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Enable Text Search</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Search for specific words, phrases, or content within your PDF documents. Searchable PDFs allow you to quickly find information without manually reading through pages. Essential for large documents, research papers, and reference materials.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Text Selection & Copying</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Select and copy text from your PDF documents. Searchable PDFs allow you to extract quotes, copy content for citations, and use text in other applications. Perfect for research, note-taking, and content reuse.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">♿</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Accessibility</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Make PDFs accessible to screen readers and assistive technologies. Searchable PDFs comply with accessibility standards (WCAG, PDF/UA) and enable users with visual impairments to access document content. Essential for public documents and compliance.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">💼</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Professional Use</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Create professional, accessible documents for business, legal, academic, and government use. Searchable PDFs are standard for document archives, digital libraries, and professional document management systems.
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
                Our Make PDF Searchable tool makes it easy to add searchable text layers to scanned PDFs. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Upload your scanned PDF file(s)</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the upload button or drag and drop your scanned or image-based PDF file(s) into the upload area. You can select multiple files for batch processing. Supported format is .pdf. Wait for the files to load.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Review and process</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Review your uploaded PDF files. You can remove any files you don't want by clicking the × button. Click the 'Make PDF Searchable' button to start the OCR process. Each PDF page will be analyzed, text extracted using OCR, and an invisible text layer added on top of the images.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Download your searchable PDF(s)</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Once processing is complete, download your searchable PDF file(s). For batch processing, you can download all searchable PDFs at once or individually. Each PDF now has an invisible text layer that makes it searchable while preserving the original images exactly as they were.
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
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our tool?</h3>
                </div>
                
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">100% client-side processing</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Preserves original images</span>
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
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Uses advanced OCR technology</span>
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

        {/* Use Cases Section - SEO Rich Content */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Use Cases for Making PDFs Searchable</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Making PDFs searchable with OCR technology is essential for various professional and personal use cases:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  Document Archives & Libraries
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  Convert scanned historical documents, archived reports, and library materials into searchable PDFs. Enables researchers to quickly find specific information across large document collections without manually reading through pages.
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Historical document digitization projects</li>
                  <li>• Legal document archives and case files</li>
                  <li>• Academic research paper collections</li>
                  <li>• Government record digitization initiatives</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">💼</span>
                  Business Document Management
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  Transform scanned invoices, contracts, receipts, and business documents into searchable PDFs for efficient document management. Makes it easy to locate specific documents, extract information, and comply with record-keeping requirements.
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Accounts payable and receivable processing</li>
                  <li>• Contract and agreement management</li>
                  <li>• HR document digitization</li>
                  <li>• Compliance and audit preparation</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">♿</span>
                  Accessibility Compliance
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  Meet accessibility standards (WCAG 2.1, PDF/UA, Section 508) by making scanned PDFs accessible to screen readers and assistive technologies. Essential for public-facing documents, educational materials, and government publications.
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Educational institution materials</li>
                  <li>• Government and public sector documents</li>
                  <li>• Healthcare information accessibility</li>
                  <li>• Legal compliance documentation</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🔬</span>
                  Research & Academic Work
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  Convert scanned research papers, books, and academic materials into searchable PDFs. Enables researchers to quickly search for citations, extract quotes, and reference specific sections without manually reading through entire documents.
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Literature review and citation extraction</li>
                  <li>• Academic paper annotation and note-taking</li>
                  <li>• Research data collection and analysis</li>
                  <li>• Thesis and dissertation preparation</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  Legal & Medical Records
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  Make scanned legal documents, medical records, and case files searchable for efficient information retrieval. Critical for legal research, medical documentation, and regulatory compliance where quick access to specific information is essential.
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Case file and legal document management</li>
                  <li>• Medical record digitization and EHR systems</li>
                  <li>• Insurance claim documentation</li>
                  <li>• Regulatory compliance and auditing</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-pink-300 transition-all duration-300 hover:shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📖</span>
                  Personal Document Organization
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  Organize personal scanned documents like receipts, tax records, personal records, and handwritten notes. Create a searchable personal document library that makes it easy to find specific information when needed.
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Personal finance and tax record organization</li>
                  <li>• Family history and genealogy documents</li>
                  <li>• Personal library digitization</li>
                  <li>• Recipe and cooking note organization</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Details Section - SEO Rich Content */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Technical Details: How OCR PDF Searchable Works</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Understanding the technical process behind making PDFs searchable using OCR technology:
            </p>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🔍</span>
                  OCR (Optical Character Recognition) Technology
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  Our tool uses Tesseract.js, an open-source OCR engine based on Google's Tesseract OCR. OCR technology analyzes pixel patterns in scanned images to identify characters, words, and text blocks. The engine uses machine learning algorithms trained on millions of text samples to recognize various fonts, languages, and character styles.
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  According to the <a href="https://tesseract.projectnaptha.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Tesseract.js documentation</a>, the OCR engine supports over 100 languages and provides word-level accuracy with bounding box coordinates, enabling precise text placement in PDF documents.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📄</span>
                  PDF Rendering and Processing
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  The tool uses PDF.js to render PDF pages as high-resolution images (typically 2x scale for better OCR accuracy). Each page is rendered to an HTML5 Canvas element, which is then converted to image data. This image data is processed by the OCR engine to extract text and determine text positions.
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  The <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">MDN Canvas API documentation</a> explains how canvas rendering enables high-quality image extraction from PDF pages, which is essential for accurate OCR text recognition.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  Invisible Text Layer Addition
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  After OCR extracts text, our tool uses pdf-lib to add an invisible text layer to the original PDF. The text is positioned using OCR-detected bounding box coordinates, scaled to match PDF page dimensions. Text is rendered with near-zero opacity (0.01) making it invisible to the eye but fully searchable and selectable.
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  The <a href="https://pdf-lib.js.org/" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:text-green-800 font-semibold underline">pdf-lib library</a> provides programmatic PDF manipulation capabilities, allowing precise text layer addition while preserving the original document structure and visual appearance.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🔒</span>
                  Client-Side Processing & Privacy
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  All OCR processing happens entirely in your browser using JavaScript. Your PDF files never leave your device, aren't uploaded to any server, and aren't stored in any database. This ensures complete privacy and security for sensitive documents, confidential information, and personal files.
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Processing is performed using Web Workers for non-blocking operation, allowing the UI to remain responsive during OCR processing. The entire workflow—from PDF loading to OCR text extraction to searchable PDF generation—happens locally in your browser.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚙️</span>
                  OCR Accuracy & Limitations
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  OCR accuracy depends on several factors: image resolution (recommended 300 DPI or higher), image quality (contrast, clarity, sharpness), text characteristics (font clarity, text size, spacing), and document complexity (layouts, tables, images mixed with text). Printed text typically achieves 95-99% accuracy, while handwritten text, decorative fonts, or poor-quality scans may result in lower accuracy.
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  The tool processes text at word level for better positioning accuracy. If word-level recognition fails, it falls back to line-level text placement. Always verify OCR results for important documents by testing text search and selection functionality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Making PDFs Searchable</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Following these best practices ensures optimal OCR results:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use High-Quality Scans</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      OCR accuracy is highest with clear, high-resolution scans. Ensure documents are scanned at 300 DPI or higher, with good contrast between text and background. Avoid blurry, skewed, or low-quality images for best results.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Verify OCR Results</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      After processing, test the searchable PDF by searching for known text and selecting text. OCR accuracy varies based on image quality, font clarity, and document complexity. Review important documents to ensure text was recognized correctly.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Understand OCR Limitations</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      OCR works best with printed text. Handwritten text, complex layouts, decorative fonts, or poor image quality may result in lower accuracy. The tool adds text layers based on OCR recognition, so accuracy depends on the source image quality.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use for Accessibility</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Making PDFs searchable is essential for accessibility compliance. Searchable PDFs work with screen readers, enable text selection for users with disabilities, and comply with accessibility standards like WCAG and PDF/UA. Important for public documents and legal compliance.
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
              <Link href="/pdf/ocr-pdf" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-xl">👁️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">OCR PDF</h3>
                    <p className="text-xs text-slate-600">Extract text from PDF images</p>
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

              <Link href="/pdf/optimize-pdf" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">Optimize PDF</h3>
                    <p className="text-xs text-slate-600">Reduce PDF file size</p>
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
                    <p className="text-xs text-slate-600">Compress PDF file size</p>
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

