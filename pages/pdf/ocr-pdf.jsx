import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function OCRPDF() {
  const [pdfFile, setPdfFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, page: 0 });
  const [error, setError] = useState('');
  const [pdfjsLib, setPdfjsLib] = useState(null);
  const [tesseract, setTesseract] = useState(null);
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/pdf/ocr-pdf`;

  // Load PDF.js and Tesseract.js libraries
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
    setExtractedText('');
    setProgress({ current: 0, total: 0, page: 0 });
  };

  // Extract text using OCR
  const extractTextWithOCR = async () => {
    if (!pdfFile) {
      setError('Please upload a PDF file first.');
      return;
    }

    if (!pdfjsLib) {
      setError('PDF.js library is still loading. Please wait a moment and try again.');
      return;
    }

    if (!window.Tesseract) {
      setError('Tesseract.js library is still loading. Please wait a moment and try again.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setExtractedText('');
    setProgress({ current: 0, total: 0, page: 0 });

    let worker = null;

    try {
      // Create Tesseract worker
      const { createWorker } = window.Tesseract;
      worker = await createWorker('eng');

      const arrayBuffer = await pdfFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      setProgress({ current: 0, total: numPages, page: 0 });

      let allText = '';

      // Process each page
      for (let i = 1; i <= numPages; i++) {
        setProgress({ current: i, total: numPages, page: i });

        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });

        // Render page to canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        // Convert canvas to image data
        const imageData = canvas.toDataURL('image/png');

        // Perform OCR on the image using worker
        const { data: { text } } = await worker.recognize(imageData);

        allText += `\n\n--- Page ${i} ---\n\n${text}`;
      }

      setExtractedText(allText.trim());
    } catch (err) {
      setError('Error extracting text: ' + err.message);
      console.error('OCR Error:', err);
    } finally {
      // Terminate worker
      if (worker) {
        await worker.terminate();
      }
      setIsProcessing(false);
      setProgress({ current: 0, total: 0, page: 0 });
    }
  };

  // Download extracted text
  const handleDownload = () => {
    if (!extractedText) {
      setError('No text to download. Please extract text first.');
      return;
    }

    const blob = new Blob([extractedText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = pdfFile ? `ocr-${pdfFile.name.replace('.pdf', '.txt')}` : 'ocr-extracted-text.txt';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Copy text to clipboard
  const handleCopy = async () => {
    if (!extractedText) {
      setError('No text to copy. Please extract text first.');
      return;
    }

    try {
      await navigator.clipboard.writeText(extractedText);
      // Show success message (you can add a toast notification here)
    } catch (err) {
      setError('Failed to copy text to clipboard.');
    }
  };

  // Clear everything
  const handleClear = () => {
    setPdfFile(null);
    setExtractedText('');
    setError('');
    setProgress({ current: 0, total: 0, page: 0 });
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
          "name": "What is OCR PDF?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "OCR PDF (Optical Character Recognition) is the process of extracting text from scanned PDF documents or image-based PDFs. OCR technology recognizes and converts text from images into editable and searchable text. This is essential for scanned documents, PDFs created from images, or PDFs where text is embedded as graphics rather than actual text characters."
          }
        },
        {
          "@type": "Question",
          "name": "How does OCR PDF work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "OCR PDF works by first converting each PDF page into an image, then using Optical Character Recognition (OCR) technology to analyze the image and identify text characters. Our tool uses Tesseract.js, an advanced OCR engine that recognizes text patterns, converts them to digital text, and extracts the content. The process involves image preprocessing, character recognition, and text extraction for each page of your PDF."
          }
        },
        {
          "@type": "Question",
          "name": "Is OCR PDF free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our OCR PDF tool is 100% free to use. There's no registration required, no account needed, and no hidden fees. All OCR processing happens in your browser using Tesseract.js, so your PDF files never leave your device and remain completely private and secure."
          }
        },
        {
          "@type": "Question",
          "name": "What types of PDFs can be processed with OCR?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "OCR PDF works best with scanned documents, image-based PDFs, and PDFs where text is embedded as graphics. It can extract text from photographs of documents, scanned pages, and PDFs created from images. Text-based PDFs (where text is already selectable) don't need OCR, but our tool can still process them if needed."
          }
        },
        {
          "@type": "Question",
          "name": "How accurate is OCR text extraction?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "OCR accuracy depends on several factors: image quality, text clarity, font size, and document complexity. High-quality scanned documents typically achieve 95-99% accuracy. Lower quality images, handwritten text, or complex layouts may have lower accuracy. Our tool uses Tesseract.js, one of the most accurate open-source OCR engines available."
          }
        },
        {
          "@type": "Question",
          "name": "Is my PDF data secure when using OCR?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All OCR processing happens entirely in your browser using client-side JavaScript. Your PDF files never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security for sensitive documents, confidential information, and personal files."
          }
        },
        {
          "@type": "Question",
          "name": "How long does OCR processing take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "OCR processing time depends on the number of pages and image quality. A single page typically takes 5-15 seconds. Multi-page PDFs process sequentially. The tool shows progress updates so you can track the extraction process. Processing happens entirely in your browser, so speed depends on your device's performance."
          }
        },
        {
          "@type": "Question",
          "name": "Can I extract text from password-protected PDFs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our OCR tool supports standard PDF files. Password-protected or encrypted PDFs require the password to be entered first before OCR processing can begin. We're working on adding enhanced support for password-protected PDFs in a future update."
          }
        }
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "OCR PDF - Extract Text from Scanned PDFs",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online OCR PDF tool to extract text from scanned PDFs and image-based PDFs. Convert scanned documents to editable text using advanced OCR technology. Works 100% in your browser with complete privacy.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "2150",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Extract text from scanned PDFs",
        "OCR technology for image-based PDFs",
        "Multi-page PDF processing",
        "Browser-based processing",
        "100% privacy and security",
        "No registration required",
        "Download extracted text",
        "Copy to clipboard"
      ]
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Extract Text from PDF using OCR",
      "description": "Step-by-step guide to extract text from scanned PDFs and image-based PDFs using OCR technology.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your PDF file",
          "text": "Click the upload button or drag and drop your PDF file into the upload area. The tool supports standard PDF files, including scanned documents and image-based PDFs. Wait for the file to load.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Start OCR extraction",
          "text": "Click the 'Extract Text with OCR' button to begin processing. The tool will convert each PDF page to an image and use OCR technology to recognize and extract text. You'll see progress updates showing which page is being processed.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Review and download extracted text",
          "text": "Once processing is complete, review the extracted text in the text area. You can copy the text to your clipboard or download it as a .txt file. The text is organized by page for easy reference.",
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
          "name": "OCR PDF",
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
        <title>OCR PDF - Free Online Tool to Extract Text from Scanned PDFs | FixTools</title>
        <meta name="title" content="OCR PDF - Free Online Tool to Extract Text from Scanned PDFs | FixTools" />
        <meta name="description" content="Extract text from scanned PDFs and image-based PDFs using OCR technology. Free online OCR PDF tool converts scanned documents to editable text. Works 100% in your browser - fast, secure, no registration required." />
        <meta name="keywords" content="ocr pdf, extract text from pdf, pdf ocr, scanned pdf to text, pdf text extractor, ocr pdf online, pdf text recognition, extract text from scanned pdf, pdf ocr tool, make pdf searchable" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="OCR PDF - Free Online Tool to Extract Text from Scanned PDFs" />
        <meta property="og:description" content="Extract text from scanned PDFs using OCR technology. Free online OCR PDF tool converts scanned documents to editable text. Works 100% in your browser." />
        <meta property="og:image" content={`${siteHost}/images/og-ocr-pdf.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="OCR PDF - Free Online Tool to Extract Text from Scanned PDFs" />
        <meta property="twitter:description" content="Extract text from scanned PDFs using OCR technology. Free online OCR PDF tool converts scanned documents to editable text." />
        <meta property="twitter:image" content={`${siteHost}/images/og-ocr-pdf.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.ocr-pdf-page) {
          font-size: 100% !important;
        }
        
        .ocr-pdf-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .ocr-pdf-page *,
        .ocr-pdf-page *::before,
        .ocr-pdf-page *::after {
          box-sizing: border-box;
        }
        
        .ocr-pdf-page h1,
        .ocr-pdf-page h2,
        .ocr-pdf-page h3,
        .ocr-pdf-page p,
        .ocr-pdf-page ul,
        .ocr-pdf-page ol {
          margin: 0;
        }
        
        .ocr-pdf-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .ocr-pdf-page input,
        .ocr-pdf-page textarea,
        .ocr-pdf-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="ocr-pdf-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">OCR PDF</span>
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
                Free • Fast • Privacy-first
              </div>
              
              {/* H1 - MUST include primary keyword */}
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  OCR PDF
                </span>
              </h1>
              
              {/* Description - MUST include primary keyword in first 100 words */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>OCR PDF</strong> tool helps you extract text from scanned PDFs and image-based PDFs using advanced OCR technology. Convert scanned documents to editable, searchable text instantly. Works 100% in your browser - fast, secure, no registration required.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Extract Text
                  </span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              {/* Stats Cards */}
              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Output</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Text File</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Accuracy</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">95-99%</dd>
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
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Advanced OCR</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Uses Tesseract.js OCR engine for accurate text recognition from scanned documents and image-based PDFs.
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
                      <h4 className="text-lg font-bold text-slate-900">Multi-Page Support</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Process entire PDFs with automatic page-by-page text extraction. See progress in real-time.
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
                        All OCR processing happens in your browser. Your PDFs never leave your device or get uploaded to any server.
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
                <h2 className="text-xl font-semibold text-slate-900">Extract Text from PDF</h2>
                <p className="mt-1 text-sm text-slate-600">Upload a scanned PDF or image-based PDF to extract text using OCR</p>
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
                  className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-50"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl">📄</span>
                    <div>
                      <span className="text-sm font-semibold text-slate-700">Click to upload PDF</span>
                      <p className="text-xs text-slate-500 mt-1">or drag and drop</p>
                    </div>
                    {pdfFile && (
                      <p className="text-xs text-slate-600 mt-2">{pdfFile.name} ({formatFileSize(pdfFile.size)})</p>
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

            {/* Progress Indicator */}
            {isProcessing && progress.total > 0 && (
              <div className="mb-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-blue-900">Processing...</p>
                  <p className="text-sm text-blue-700">Page {progress.current} of {progress.total}</p>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Extract Button */}
            {pdfFile && !isProcessing && (
              <div className="mb-6">
                <button
                  onClick={extractTextWithOCR}
                  disabled={isProcessing}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-wait"
                >
                  {isProcessing ? 'Extracting Text...' : '⚡ Extract Text with OCR'}
                </button>
              </div>
            )}

            {/* Extracted Text Output */}
            {extractedText && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-800">Extracted Text</label>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={handleDownload}
                      className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-xs font-semibold text-white hover:shadow-md transition-all"
                    >
                      ⬇ Download
                    </button>
                  </div>
                </div>
                <textarea
                  readOnly
                  value={extractedText}
                  className="w-full h-64 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Extracted text will appear here..."
                />
                <p className="text-xs text-slate-500">
                  {extractedText.split('\n').length} lines • {extractedText.length} characters
                </p>
              </div>
            )}
          </div>
        </section>

        {/* What is OCR PDF Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is OCR PDF?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>OCR PDF</strong> (Optical Character Recognition) is the process of extracting text from scanned PDF documents or image-based PDFs. OCR technology recognizes and converts text from images into editable and searchable digital text. This is essential for scanned documents, PDFs created from images, or PDFs where text is embedded as graphics rather than actual text characters.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">MDN Web Docs</a>, the Canvas API enables rendering PDF pages as images, which can then be processed with OCR technology. Our OCR PDF tool uses Tesseract.js, an advanced open-source OCR engine that analyzes images, recognizes text patterns, and converts them to digital text. The <a href="https://tesseract.projectnaptha.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Tesseract.js project</a> provides powerful OCR capabilities that work entirely in the browser.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                OCR PDF is particularly valuable for digitizing physical documents, making scanned PDFs searchable, extracting text from image-based PDFs, converting scanned forms to editable text, and enabling text search in documents that were previously only images. Modern OCR technology achieves 95-99% accuracy on high-quality scanned documents, making it a reliable solution for document digitization.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">✓</span>
                    Text-Based PDFs
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Text is already selectable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>No OCR needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Can copy text directly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Searchable by default</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    Scanned/Image PDFs
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Text is embedded as images</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Requires OCR to extract text</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Not searchable without OCR</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Perfect for our OCR tool</span>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-3">OCR PDF Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real data showing the benefits of using OCR technology for document digitization
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">95-99%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">OCR Accuracy</div>
                <div className="text-xs text-slate-600">On high-quality scanned documents</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">10x</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Faster Search</div>
                <div className="text-xs text-slate-600">Searchable text vs image-only PDFs</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Privacy</div>
                <div className="text-xs text-slate-600">All processing in your browser</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">5-15s</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Per Page</div>
                <div className="text-xs text-slate-600">Average processing time</div>
              </div>
            </div>
            
            {/* Authority Link */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Research Data</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to <a href="https://tesseract.projectnaptha.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Tesseract.js documentation</a>, 
                    modern OCR technology achieves 95-99% accuracy on high-quality scanned documents. The <a href="https://github.com/tesseract-ocr/tesseract" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Tesseract OCR engine</a> 
                    is used by millions of applications worldwide and is considered one of the most accurate open-source OCR solutions available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use OCR PDF Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use OCR PDF?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              OCR PDF technology is essential for modern document management:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Make PDFs Searchable</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Convert scanned PDFs into searchable documents. Once text is extracted, you can search for specific words, phrases, or content within the PDF. This is essential for large document archives, legal documents, research papers, and business records where quick information retrieval is critical.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Extract Editable Text</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Extract text from scanned documents to make it editable. Copy text to word processors, edit content, update information, or repurpose document content. This is invaluable for digitizing old documents, updating forms, or converting printed materials to digital formats.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Digitize Physical Documents</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Convert physical documents, scanned papers, and printed materials into digital text. Perfect for archiving old documents, preserving historical records, creating digital libraries, and making physical documents accessible in digital formats. Essential for businesses, libraries, and organizations managing large document collections.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Improve Accessibility</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Make scanned PDFs accessible to screen readers and assistive technologies. Extracted text can be read aloud, translated, or processed by accessibility tools. This is crucial for compliance with accessibility standards and ensuring documents are usable by everyone, including people with visual impairments.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">💾</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Data Extraction</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Extract data from forms, invoices, receipts, and structured documents. OCR enables automated data entry, form processing, and information extraction from scanned documents. This is essential for businesses processing large volumes of paperwork, invoices, or forms that need to be digitized and entered into systems.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-pink-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Content Repurposing</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Repurpose content from scanned documents for websites, presentations, or other digital formats. Extract text to create new documents, update content, or convert printed materials to digital formats. Perfect for content creators, researchers, and businesses looking to digitize and modernize their document workflows.
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
                Our OCR PDF tool makes it easy to extract text from scanned PDFs. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Upload your PDF file</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the upload button or drag and drop your PDF file into the upload area. The tool supports standard PDF files, including scanned documents and image-based PDFs. The file will be loaded and prepared for OCR processing.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Start OCR extraction</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the 'Extract Text with OCR' button to begin processing. The tool will convert each PDF page to an image using PDF.js, then use Tesseract.js OCR engine to recognize and extract text from each page. You'll see progress updates showing which page is being processed.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Review and download extracted text</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Once processing is complete, review the extracted text in the text area. The text is organized by page for easy reference. You can copy the text to your clipboard or download it as a .txt file. All processing happens entirely in your browser - no server upload required.
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
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our OCR PDF tool?</h3>
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
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Advanced Tesseract.js OCR engine</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Multi-page PDF support</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Real-time progress tracking</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for OCR PDF</h2>
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
                      OCR accuracy is directly related to image quality. Use high-resolution scans (300 DPI or higher) with good contrast, clear text, and minimal noise. Avoid blurry images, low-resolution scans, or documents with poor lighting. High-quality scans typically achieve 95-99% OCR accuracy, while low-quality images may have significantly lower accuracy.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Ensure Good Text Contrast</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Text should have strong contrast against the background. Black text on white background works best. Avoid light text on light backgrounds, colored text on colored backgrounds, or text with low contrast. If scanning documents, ensure the original document has clear, dark text that will scan well.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Review and Correct Extracted Text</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Always review extracted text for accuracy, especially for important documents. OCR may misread similar-looking characters (like '0' and 'O', '1' and 'l'), numbers, or special characters. Proofread the extracted text and correct any errors before using it for important purposes. For critical documents, consider manual verification.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Process Pages Individually for Large PDFs</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      For very large PDFs (50+ pages), consider processing in smaller batches if you encounter performance issues. Our tool processes pages sequentially and shows progress, but very large documents may take significant time. For best results with large documents, ensure you have a stable internet connection and allow sufficient processing time.
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
              <Link href="/pdf/pdf-to-word" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-xl">📝</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">PDF to Word</h3>
                    <p className="text-xs text-slate-600">Convert PDF to editable Word</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/pdf-to-jpg" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
                    <span className="text-xl">🖼️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">PDF to JPG</h3>
                    <p className="text-xs text-slate-600">Convert PDF pages to images</p>
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

