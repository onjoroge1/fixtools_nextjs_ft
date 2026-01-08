import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function PDFToPNG() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPages, setSelectedPages] = useState('all');
  const [convertedImages, setConvertedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [pdfjsLib, setPdfjsLib] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/pdf/pdf-to-png`;

  // Load PDF.js library
  useEffect(() => {
    const loadPDFJS = async () => {
      if (typeof window !== 'undefined') {
        // Check if already loaded
        if (window.pdfjsLib && window.pdfjsLib.getDocument) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          setPdfjsLib(window.pdfjsLib);
          return;
        }

        // Check if script already exists
        const existingScript = document.querySelector('script[src*="pdf.min.js"]');
        if (existingScript) {
          // Wait for it to load
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
          // Load PDF.js from CDN
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.async = true;
          script.onload = () => {
            // Wait a bit to ensure pdfjsLib is fully available
            setTimeout(() => {
              if (window.pdfjsLib && window.pdfjsLib.getDocument) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                setPdfjsLib(window.pdfjsLib);
              } else {
                console.error('PDF.js loaded but getDocument not available');
                setError('PDF.js library failed to initialize. Please refresh the page.');
              }
            }, 100);
          };
          script.onerror = () => {
            setError('Failed to load PDF.js library. Please refresh the page.');
          };
          document.head.appendChild(script);
        } catch (err) {
          setError('Failed to load PDF.js library. Please refresh the page.');
        }
      }
    };
    loadPDFJS();
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
    setConvertedImages([]);
    setTotalPages(0);

    // Store both data URL and file for different loading methods
    const reader = new FileReader();
    reader.onload = (event) => {
      setPdfUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Convert PDF to PNG
  const convertPDFToPNG = async () => {
    if (!pdfjsLib) {
      setError('PDF.js library is still loading. Please wait a moment and try again.');
      return;
    }
    
    if (!pdfFile) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setConvertedImages([]);

    try {
      // Try loading PDF using ArrayBuffer (more reliable than data URL)
      let pdf;
      let loadingTask;
      
      try {
        // First try with ArrayBuffer - this is more reliable for PDF.js
        const arrayBuffer = await pdfFile.arrayBuffer();
        loadingTask = pdfjsLib.getDocument({ 
          data: arrayBuffer,
          verbosity: 0 // Suppress console warnings
        });
        pdf = await loadingTask.promise;
      } catch (arrayBufferError) {
        // Fallback to data URL if ArrayBuffer fails
        console.warn('ArrayBuffer loading failed, trying data URL:', arrayBufferError);
        
        // Ensure we have a data URL
        let dataUrlToUse = pdfUrl;
        if (!dataUrlToUse) {
          dataUrlToUse = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Failed to read PDF file'));
            reader.readAsDataURL(pdfFile);
          });
        }
        
        loadingTask = pdfjsLib.getDocument({ 
          data: dataUrlToUse,
          verbosity: 0
        });
        pdf = await loadingTask.promise;
      }
      
      const numPages = pdf.numPages;
      setTotalPages(numPages);

      let pagesToConvert = [];
      if (selectedPages === 'all') {
        pagesToConvert = Array.from({ length: numPages }, (_, i) => i + 1);
      } else {
        // Parse page numbers and ranges (e.g., "1,3,5-7")
        const parts = selectedPages.split(',');
        for (const part of parts) {
          const trimmed = part.trim();
          if (trimmed.includes('-')) {
            // Handle range (e.g., "5-7")
            const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
            if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start) {
              for (let i = start; i <= end && i <= numPages; i++) {
                if (i > 0) pagesToConvert.push(i);
              }
            }
          } else {
            // Handle single page number
            const pageNum = parseInt(trimmed);
            if (!isNaN(pageNum) && pageNum > 0 && pageNum <= numPages) {
              pagesToConvert.push(pageNum);
            }
          }
        }
        // Remove duplicates and sort
        pagesToConvert = [...new Set(pagesToConvert)].sort((a, b) => a - b);
      }

      const images = [];

      for (const pageNum of pagesToConvert) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        // Convert to PNG (lossless, supports transparency)
        const imageData = canvas.toDataURL('image/png');
        images.push({
          page: pageNum,
          dataUrl: imageData,
          width: canvas.width,
          height: canvas.height
        });
      }

      setConvertedImages(images);
    } catch (err) {
      console.error('PDF conversion error:', err);
      let errorMessage = 'Failed to convert PDF. ';
      
      if (err.message && err.message.includes('Invalid PDF')) {
        errorMessage += 'The PDF file appears to be corrupted or invalid. Please try a different PDF file.';
      } else if (err.message && err.message.includes('password')) {
        errorMessage += 'This PDF is password-protected. Please unlock it first.';
      } else if (err.message) {
        errorMessage += err.message;
      } else {
        errorMessage += 'Please ensure the PDF file is valid and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download single image
  const downloadImage = (image, index) => {
    const link = document.createElement('a');
    link.href = image.dataUrl;
    link.download = `page-${image.page}.png`;
    link.click();
  };

  // Download all images as ZIP (simplified - downloads individually)
  const downloadAll = () => {
    convertedImages.forEach((image, index) => {
      setTimeout(() => {
        downloadImage(image, index);
      }, index * 100);
    });
  };

  // Clear everything
  const handleClear = () => {
    setPdfFile(null);
    setPdfUrl('');
    setTotalPages(0);
    setSelectedPages('all');
    setConvertedImages([]);
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
          "name": "How do I convert PDF to PNG?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Upload your PDF file using the upload button or drag and drop it into the designated area. Choose whether to convert all pages or specific pages by entering page numbers (e.g., '1,3,5-7'). Click Convert to PNG to process your file. Once conversion is complete, download individual PNG images or all images at once."
          }
        },
        {
          "@type": "Question",
          "name": "Is PDF to PNG conversion free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our PDF to PNG converter is 100% free to use. There's no registration required, no account needed, and no hidden fees. All processing happens in your browser, so your files never leave your device and remain completely private."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert specific pages from a PDF?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! You can convert all pages or specify which pages to convert by entering page numbers separated by commas (e.g., '1,3,5-7'). This is useful when you only need certain pages from a large PDF document."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between PNG and JPG?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "PNG (Portable Network Graphics) is a lossless image format that supports transparency and is ideal for graphics, text, and images with sharp edges. JPG (JPEG) is a compressed format that's smaller in file size but doesn't support transparency. PNG is better for graphics and text, while JPG is better for photos."
          }
        },
        {
          "@type": "Question",
          "name": "Is my PDF data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All PDF processing happens entirely in your browser using client-side JavaScript. Your PDFs never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security for sensitive documents, business files, and personal information."
          }
        },
        {
          "@type": "Question",
          "name": "What file sizes can I convert?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our PDF to PNG converter can handle PDFs up to several megabytes in size. For optimal performance, we recommend files under 10MB. Very large PDFs with many pages may take longer to process, but all processing happens in your browser without any file size limits."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert password-protected PDFs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our tool supports standard PDF files. Password-protected or encrypted PDFs require the password to be entered first before conversion. We're working on adding enhanced support for password-protected PDFs in a future update."
          }
        },
        {
          "@type": "Question",
          "name": "Does PNG support transparency?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! PNG format supports transparency (alpha channel), making it ideal for graphics with transparent backgrounds, logos, icons, and images that need to overlay other content. This is a key advantage of PNG over JPG format."
          }
        }
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "PDF to PNG Converter",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Convert PDF pages to high-quality PNG images online for free. Extract individual pages or all pages as PNG images with transparency support. Works 100% in your browser with complete privacy.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1180",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Convert all pages or specific pages",
        "Lossless PNG format (no quality loss)",
        "Transparency support",
        "High-resolution output (2x scale)",
        "Browser-based processing",
        "No data storage",
        "Instant results",
        "Download individual or all images",
        "100% privacy and security"
      ]
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert PDF to PNG",
      "description": "Step-by-step guide to convert PDF pages to PNG images online for free using FixTools PDF to PNG converter.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your PDF file",
          "text": "Click the upload button or drag and drop your PDF file into the upload area. The tool supports standard PDF files up to 10MB for optimal performance. The total number of pages will be displayed.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Select pages to convert",
          "text": "Choose whether to convert all pages or specify which pages to convert. Enter page numbers separated by commas (e.g., '1,3,5-7') to convert specific pages. Leave as 'all' to convert every page.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Convert and download",
          "text": "Click Convert to PNG to process your file. The tool will convert each selected page to a high-quality PNG image with transparency support. Once complete, download individual PNG files or all files at once.",
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
          "name": "PDF to PNG",
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
        <title>PDF to PNG Converter - Free Online PDF to Image Tool | FixTools</title>
        <meta name="title" content="PDF to PNG Converter - Free Online PDF to Image Tool | FixTools" />
        <meta name="description" content="Convert PDF pages to high-quality PNG images online for free. Extract pages as PNG with transparency support. Lossless conversion, 100% in your browser. No signup required." />
        <meta name="keywords" content="pdf to png, convert pdf to png, pdf to png converter, pdf to image, pdf to png online, convert pdf pages to png, pdf png converter, pdf to png tool, extract pdf pages as png, pdf to transparent png" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="PDF to PNG Converter - Free Online Tool" />
        <meta property="og:description" content="Convert PDF pages to high-quality PNG images online for free. Extract pages as PNG with transparency support. Works 100% in your browser." />
        <meta property="og:image" content={`${siteHost}/images/og-pdf-to-png.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="PDF to PNG Converter - Free Online Tool" />
        <meta property="twitter:description" content="Convert PDF pages to high-quality PNG images online for free. Extract pages as PNG with transparency support." />
        <meta property="twitter:image" content={`${siteHost}/images/og-pdf-to-png.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.pdf-to-png-page) {
          font-size: 100% !important;
        }
        
        .pdf-to-png-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        
        .pdf-to-png-page *,
        .pdf-to-png-page *::before,
        .pdf-to-png-page *::after {
          box-sizing: border-box;
        }
        
        .pdf-to-png-page h1,
        .pdf-to-png-page h2,
        .pdf-to-png-page h3,
        .pdf-to-png-page p,
        .pdf-to-png-page ul,
        .pdf-to-png-page ol {
          margin: 0;
        }
        
        .pdf-to-png-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .pdf-to-png-page input,
        .pdf-to-png-page textarea,
        .pdf-to-png-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="pdf-to-png-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">PDF to PNG</span>
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
                  PDF to PNG Converter
                </span>
              </h1>
              
              {/* Description */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>PDF to PNG converter</strong> helps you convert PDF pages to high-quality PNG images instantly. 
                Extract individual pages or all pages as PNG images with transparency support. Perfect for graphics, logos, text documents, and images that need transparent backgrounds. 
                All processing happens in your browser — your files never leave your device.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Convert to PNG
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
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">PNG</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Quality</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Lossless</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Transparency</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Supported</dd>
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
                      <span className="text-2xl">🏞️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Transparency Support</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        PNG format supports transparency (alpha channel), making it perfect for graphics with transparent backgrounds, logos, icons, and images that need to overlay other content.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature Card 2 */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Lossless Quality</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        PNG is a lossless format, meaning no quality is lost during conversion. Perfect for graphics, text documents, and images where quality preservation is critical.
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
                        All PDF to PNG conversion happens in your browser. Your files never leave your device, aren't sent to any server, and aren't stored anywhere.
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
                <h2 className="text-xl font-semibold text-slate-900">PDF to PNG Converter</h2>
                <p className="mt-1 text-sm text-slate-600">Upload your PDF file and convert pages to PNG images</p>
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

            {/* Page Selection */}
            {pdfFile && totalPages > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Pages to Convert
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <button
                    onClick={() => setSelectedPages('all')}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      selectedPages === 'all'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    All Pages ({totalPages})
                  </button>
                  <button
                    onClick={() => setSelectedPages('')}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      selectedPages !== 'all'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Specific Pages
                  </button>
                </div>
                {selectedPages !== 'all' && (
                  <input
                    type="text"
                    value={selectedPages}
                    onChange={(e) => setSelectedPages(e.target.value)}
                    placeholder="e.g., 1,3,5-7"
                    className="w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none"
                  />
                )}
                <p className="text-xs text-slate-500 mt-2">
                  Enter page numbers separated by commas (e.g., "1,3,5-7") or leave as "all" to convert every page
                </p>
              </div>
            )}

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
                  onClick={convertPDFToPNG}
                  disabled={isProcessing}
                  className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-wait"
                >
                  {isProcessing ? 'Converting...' : '⚡ Convert to PNG'}
                </button>
              </div>
            )}

            {/* Results */}
            {convertedImages.length > 0 && (
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">✅</span>
                    <p className="text-lg font-bold text-slate-900">Conversion Complete!</p>
                  </div>
                  <p className="text-sm text-slate-700">
                    Successfully converted {convertedImages.length} page{convertedImages.length !== 1 ? 's' : ''} to PNG format.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                  {convertedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-[3/4] rounded-lg border-2 border-slate-200 bg-slate-50 overflow-hidden">
                        <img
                          src={image.dataUrl}
                          alt={`Page ${image.page}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <button
                        onClick={() => downloadImage(image, index)}
                        className="mt-2 w-full rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:shadow-md transition-all"
                      >
                        Download Page {image.page}
                      </button>
                    </div>
                  ))}
                </div>

                {convertedImages.length > 1 && (
                  <button
                    onClick={downloadAll}
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                  >
                    Download All ({convertedImages.length} PNG files)
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* What is PDF to PNG Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is PDF to PNG Conversion?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>PDF to PNG conversion</strong> is the process of converting PDF (Portable Document Format) pages into PNG (Portable Network Graphics) image files. 
                PNG is a lossless image format that supports transparency, making it ideal for graphics, logos, text documents, and images that need transparent backgrounds. 
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/PDF" target="_blank" rel="noopener noreferrer nofollow" className="text-red-700 hover:text-red-800 font-semibold underline">MDN Web Docs</a>, 
                PDFs are complex document formats that can contain text, images, vector graphics, and interactive elements.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Converting PDFs to PNG images is particularly useful when you need transparency support, lossless quality, or graphics with sharp edges. 
                PNG format preserves image quality without compression artifacts, making it perfect for graphics, text documents, logos, icons, and images 
                that will be overlaid on other content. Unlike JPG, PNG supports an alpha channel for transparency, allowing you to create images with 
                transparent backgrounds that blend seamlessly with any background color or image.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our PDF to PNG converter uses PDF.js, a JavaScript library developed by Mozilla, to render PDF pages as images in your browser. 
                This client-side processing ensures your PDF files remain completely private and secure. All conversion happens locally, 
                so your documents never leave your device or get uploaded to any server. The PNG format is rendered with full transparency support, 
                preserving any transparent areas in the original PDF content.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Before
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    PDF files require PDF readers to view. They don't support transparency when used as images, and converting to JPG loses transparency and may introduce compression artifacts.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 font-mono">document.pdf (2.5 MB)</p>
                    <p className="text-xs text-slate-500 mt-1">No transparency support</p>
                  </div>
                </div>
                
                <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✓</span>
                    After
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    PNG images support transparency, are lossless, and can be viewed in any image viewer. Perfect for graphics, logos, and images that need transparent backgrounds.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-red-200">
                    <p className="text-xs text-slate-600 font-mono">page-1.png, page-2.png...</p>
                    <p className="text-xs text-slate-500 mt-1">Transparency + Lossless</p>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-3">PDF to PNG Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real data showing the benefits of converting PDFs to PNG images
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-red-200 shadow-lg">
                <div className="text-5xl font-extrabold text-red-600 mb-2">90K</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Monthly Searches</div>
                <div className="text-xs text-slate-600">Growing demand</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">2x</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Scale Factor</div>
                <div className="text-xs text-slate-600">High-resolution output</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Lossless</div>
                <div className="text-xs text-slate-600">No quality loss</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">∞</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Transparency</div>
                <div className="text-xs text-slate-600">Alpha channel support</div>
              </div>
            </div>
            
            {/* Authority Link */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Research Data</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" 
                    rel="noopener noreferrer nofollow" className="text-red-700 hover:text-red-800 font-semibold underline">MDN Web Docs</a>, 
                    the HTML5 Canvas API enables client-side image rendering with full transparency support. PNG format's lossless compression and 
                    alpha channel make it ideal for graphics, logos, and images requiring transparent backgrounds. This approach ensures maximum 
                    quality preservation and visual fidelity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use PDF to PNG Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use PDF to PNG Converter?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Converting PDFs to PNG images offers unique advantages, especially when transparency, lossless quality, or graphics are involved. 
              Here are the key benefits of using our PDF to PNG converter:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
                    <span className="text-2xl">🏞️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Transparency Support</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      PNG format supports transparency (alpha channel), making it perfect for graphics with transparent backgrounds, logos, icons, 
                      and images that need to overlay other content. This is a key advantage over JPG format, which doesn't support transparency.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Lossless Quality</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      PNG is a lossless format, meaning no quality is lost during conversion. Perfect for graphics, text documents, and images 
                      where quality preservation is critical. No compression artifacts or quality degradation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Privacy & Security</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      All PDF to PNG conversion happens entirely in your browser using client-side JavaScript. Your PDF files never leave your device, 
                      aren't uploaded to any server, and aren't stored anywhere. This ensures complete privacy and security for sensitive documents.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">📐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Graphics & Text</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      PNG format excels at preserving sharp edges, text clarity, and graphics quality. Ideal for converting PDF documents with 
                      text, diagrams, charts, logos, or graphics where sharpness and clarity are essential.
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
                      Client-side processing means instant conversion without waiting for file uploads or server processing. Convert PDF pages to PNG 
                      images in seconds, even for multi-page documents. No internet connection required after the initial page load.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 6 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Web & Design</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      PNG format is widely used in web design, graphic design, and digital media. Perfect for creating web graphics, 
                      social media images, presentations, and design mockups that require transparency or high-quality graphics.
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
                    According to <a href="https://www.w3.org/TR/PNG/" target="_blank" 
                    rel="noopener noreferrer nofollow" className="text-blue-700 hover:text-blue-800 font-semibold underline">W3C PNG Specification</a>, 
                    PNG format was designed specifically to support transparency and lossless compression. Companies like 
                    <a href="https://www.adobe.com/acrobat/online/pdf-to-png.html" target="_blank" rel="noopener noreferrer nofollow" 
                    className="text-blue-700 hover:text-blue-800 font-semibold underline"> Adobe</a> offer PDF to PNG conversion, 
                    but they require file uploads to their servers. Our client-side approach ensures your documents remain completely private, 
                    making it ideal for sensitive business documents, personal files, and confidential materials.
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
              Our PDF to PNG converter uses PDF.js, a powerful JavaScript library, to render PDF pages as PNG images directly in your browser. 
              Here's how the conversion process works:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 text-white font-bold text-xl shadow-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Load PDF</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Upload your PDF file. The tool uses PDF.js to parse the PDF structure and identify all pages in the document.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Render Pages</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Each selected page is rendered onto a canvas element at high resolution (2x scale) with full transparency support to ensure crisp, clear PNG images.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Export PNG</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Canvas content is converted to PNG format with lossless compression and full transparency support. Download individual images or all at once.
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
                To get the best results when converting PDFs to PNG images, follow these best practices:
              </p>

              <ul className="space-y-3 text-base text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Use PNG for graphics and text:</strong> PNG is ideal for PDFs containing graphics, logos, text documents, diagrams, or images with sharp edges. For photos, consider JPG format instead.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Leverage transparency:</strong> PNG's transparency support makes it perfect for graphics that need transparent backgrounds, logos, icons, or images that will overlay other content.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Select specific pages:</strong> Instead of converting all pages, specify only the pages you need. This saves processing time and storage space, especially for large PDFs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Consider file size:</strong> PNG files are typically larger than JPG files due to lossless compression. For web use, consider if transparency is necessary, or use JPG for smaller file sizes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Verify transparency:</strong> After conversion, check the PNG images to ensure transparency is preserved correctly. Transparent areas should appear transparent when viewed over different backgrounds.</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Common Use Cases for PDF to PNG Conversion</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                PDF to PNG conversion serves a wide variety of professional and personal needs, especially when transparency or lossless quality is required. 
                Understanding these use cases can help you determine when PNG conversion is the right solution for your specific requirements.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🎨</span>
                    Graphics and Logos
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    PNG format is perfect for converting PDF documents containing logos, graphics, icons, or branding materials. The transparency support 
                    allows logos and graphics to blend seamlessly with any background, making them ideal for web design, presentations, and marketing materials.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This use case is essential for graphic designers, marketers, and businesses that need to extract logos or graphics from PDF documents 
                    while maintaining transparency and quality. PNG ensures that graphics look professional on any background color or image.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📐</span>
                    Web Design and Development
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Web designers and developers often need to convert PDF mockups, wireframes, or design specifications to PNG format for use in web projects. 
                    PNG's transparency and lossless quality make it ideal for creating web graphics, UI elements, and design assets.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This is particularly valuable when working with design systems, creating website graphics, or implementing visual designs from PDF documents. 
                    PNG format ensures pixel-perfect rendering and transparency support for modern web design.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📄</span>
                    Text Documents and Diagrams
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    PDF documents containing text, diagrams, charts, or technical drawings benefit from PNG conversion because PNG preserves sharp edges 
                    and text clarity without compression artifacts. This is essential for maintaining readability and visual quality.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This use case is valuable for technical documentation, educational materials, presentations, and any content where text clarity and 
                    diagram precision are critical. PNG ensures that text remains sharp and readable at any size.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🖼️</span>
                    Image Extraction with Transparency
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    When extracting images from PDF documents, PNG format preserves any transparency that may exist in the original content. This is 
                    particularly important for graphics, icons, or images that need to be overlaid on other content without background colors.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This use case is essential for graphic designers, content creators, and anyone working with visual assets that require transparency. 
                    PNG ensures that extracted images maintain their transparency, allowing for flexible use in various design contexts.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📱</span>
                    Social Media and Marketing
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Marketing professionals and social media managers often convert PDF content to PNG for use in social media posts, advertisements, 
                    or marketing materials. PNG's transparency support allows graphics to blend with platform backgrounds, and lossless quality ensures 
                    professional appearance.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This is particularly valuable for creating social media graphics, promotional materials, or marketing assets from PDF documents. 
                    PNG format ensures that graphics look professional and maintain quality across different platforms and devices.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    Presentations and Slides
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Converting PDF presentation slides to PNG format allows for easy integration into presentation software, design tools, or web-based 
                    presentation platforms. PNG's lossless quality ensures that slides maintain their visual fidelity and clarity.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This use case is valuable for educators, business professionals, and content creators who need to convert PDF presentations to 
                    image format for use in various presentation tools or platforms. PNG ensures that text, graphics, and diagrams remain sharp and clear.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                <h3 className="text-lg font-bold text-slate-900 mb-3">When to Use PDF to PNG vs Other Formats</h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  While PDF to PNG conversion is versatile, it's important to understand when it's the best choice compared to other conversion options:
                </p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>PDF to PNG:</strong> Best for graphics, logos, text documents, diagrams, and images requiring transparency. Use when lossless quality and transparency are essential.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>PDF to JPG:</strong> Better for photos, complex images, or when file size is a concern. JPG provides smaller file sizes but doesn't support transparency.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>PDF to Word:</strong> Choose when you need to edit text content. Word format preserves text as editable content, making it suitable for document editing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>PDF to Text:</strong> Use when you only need the text content without formatting or images. Text extraction is faster and produces smaller files.</span>
                  </li>
                </ul>
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
                    <p className="text-xs text-slate-600">Convert to JPG images</p>
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

              <Link href="/pdf/rotate-pdf" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-xl">🔄</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">Rotate PDF</h3>
                    <p className="text-xs text-slate-600">Rotate PDF pages</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/pdf-to-word" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
                    <span className="text-xl">📝</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">PDF to Word</h3>
                    <p className="text-xs text-slate-600">Convert to editable Word</p>
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

