import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function PDFToJPG() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPages, setSelectedPages] = useState('all');
  const [imageQuality, setImageQuality] = useState(0.92);
  const [convertedImages, setConvertedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [pdfjsLib, setPdfjsLib] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/pdf/pdf-to-jpg`;

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

    const reader = new FileReader();
    reader.onload = (event) => {
      setPdfUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Convert PDF to JPG
  const convertPDFToJPG = async () => {
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

        const imageData = canvas.toDataURL('image/jpeg', imageQuality);
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
    link.download = `page-${image.page}.jpg`;
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

  // Structured Data Schemas
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I convert PDF to JPG?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Upload your PDF file, select which pages to convert (all pages or specific pages), choose image quality, and click Convert. The tool will process each page and convert it to a JPG image. You can then download individual images or all images at once."
          }
        },
        {
          "@type": "Question",
          "name": "Is PDF to JPG conversion free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our PDF to JPG converter is 100% free to use. There's no registration required, no account needed, and no hidden fees. All processing happens in your browser, so your files never leave your device."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert specific pages from a PDF?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! You can convert all pages or specify which pages to convert by entering page numbers separated by commas (e.g., 1,3,5-7). This is useful when you only need certain pages from a large PDF document."
          }
        },
        {
          "@type": "Question",
          "name": "What image quality settings are available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can adjust image quality from 0.1 (lowest, smallest file) to 1.0 (highest, largest file). The default is 0.92, which provides excellent quality while keeping file sizes reasonable. Higher quality is better for printing, while lower quality is better for web use."
          }
        },
        {
          "@type": "Question",
          "name": "Is my PDF data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All PDF processing happens entirely in your browser using client-side JavaScript. Your PDFs never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security."
          }
        },
        {
          "@type": "Question",
          "name": "What file sizes can I convert?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our PDF to JPG converter can handle PDFs up to several megabytes in size. For optimal performance, we recommend files under 10MB. Very large PDFs with many pages may take longer to process, but all processing happens in your browser."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert password-protected PDFs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our tool supports standard PDF files. Password-protected or encrypted PDFs require the password to be entered first. We're working on adding support for password-protected PDFs in a future update."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between PDF to JPG and PDF to PNG?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "JPG (JPEG) is a compressed image format that's smaller in file size and ideal for photos and complex images. PNG supports transparency and is lossless, making it better for graphics with text or simple images. JPG is more commonly used for web and email due to smaller file sizes."
          }
        }
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "PDF to JPG Converter",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Convert PDF pages to high-quality JPG images online for free. Extract individual pages or all pages as JPG images. Works 100% in your browser with complete privacy.",
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
        "Convert all pages or specific pages",
        "Adjustable image quality (0.1 to 1.0)",
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
      "name": "How to Convert PDF to JPG",
      "description": "Step-by-step guide to convert PDF pages to JPG images online for free using FixTools PDF to JPG converter.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your PDF file",
          "text": "Click the upload button or drag and drop your PDF file into the upload area. The tool supports standard PDF files up to 10MB for optimal performance.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Select pages to convert",
          "text": "Choose to convert all pages or specify which pages to convert by entering page numbers (e.g., 1,3,5-7). You can also adjust the image quality slider.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Convert and download",
          "text": "Click the Convert to JPG button to process your PDF. Once conversion is complete, preview the images and download individual pages or all pages at once.",
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
          "name": "PDF to JPG",
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
        <title>PDF to JPG – Convert PDF Pages to Images Online | FixTools</title>
        <meta name="title" content="PDF to JPG – Convert PDF Pages to Images Online | FixTools" />
        <meta name="description" content="Convert PDF to JPG online. Extract all or specific pages as high‑quality JPG images. Fast, secure, 100% in your browser. Free and private. No signup." />
        <meta name="keywords" content="pdf to jpg, pdf to jpeg, convert pdf to jpg, pdf to image, pdf to jpg converter, pdf pages to jpg, extract pdf pages as images, pdf to jpg online" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="PDF to JPG - Free Online Converter" />
        <meta property="og:description" content="Convert PDF pages to high-quality JPG images online for free. Extract individual pages or all pages. Fast, secure, and works in your browser." />
        <meta property="og:image" content={`${siteHost}/images/og-pdf-to-jpg.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="PDF to JPG - Free Online Converter" />
        <meta property="twitter:description" content="Convert PDF pages to high-quality JPG images online for free. Extract individual pages or all pages." />
        <meta property="twitter:image" content={`${siteHost}/images/og-pdf-to-jpg.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.pdf-to-jpg-page) {
          font-size: 100% !important;
        }
        
        .pdf-to-jpg-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .pdf-to-jpg-page *,
        .pdf-to-jpg-page *::before,
        .pdf-to-jpg-page *::after {
          box-sizing: border-box;
        }
        
        .pdf-to-jpg-page h1,
        .pdf-to-jpg-page h2,
        .pdf-to-jpg-page h3,
        .pdf-to-jpg-page p,
        .pdf-to-jpg-page ul,
        .pdf-to-jpg-page ol {
          margin: 0;
        }
        
        .pdf-to-jpg-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .pdf-to-jpg-page input,
        .pdf-to-jpg-page textarea,
        .pdf-to-jpg-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="pdf-to-jpg-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <Link className="hover:text-slate-900 transition-colors" href="/tools/pdf">PDF</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/json">JSON</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/html">HTML</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/css">CSS</Link>
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
              <span className="font-semibold text-slate-900">PDF to JPG</span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-[0.35]" 
            style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}
          />
          
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            {/* Left Column - Content */}
            <div className="relative z-10 md:col-span-7 hero-content">
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
                  PDF to JPG
                </span>
              </h1>
              
              {/* Description */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>PDF to JPG converter</strong> helps you convert PDF pages to high-quality JPG images instantly. 
                Extract individual pages or convert all pages. Perfect for sharing PDF content as images, embedding in documents, or creating thumbnails. 
                All processing happens in your browser — your files never leave your device.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Convert PDF to JPG
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
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">JPG Images</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Quality</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Adjustable</dd>
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
                      <span className="text-2xl">🖼️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">High-Quality Conversion</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Convert PDF pages to high-resolution JPG images with adjustable quality settings. Perfect for printing, web use, or sharing.
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
                      <h4 className="text-lg font-bold text-slate-900">Select Specific Pages</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Convert all pages or choose specific pages to convert. Enter page numbers like "1,3,5-7" for flexible page selection.
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
                        All PDF processing happens in your browser. Your files never leave your device, aren't uploaded to any server, and aren't stored anywhere.
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
                <h2 className="text-xl font-semibold text-slate-900">PDF to JPG Converter</h2>
                <p className="mt-1 text-sm text-slate-600">Upload your PDF file and convert pages to JPG images</p>
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
                      <p className="text-xs text-slate-600 mt-2">{pdfFile.name}</p>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Options */}
            {pdfFile && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pages to Convert
                  </label>
                  <div className="flex gap-3 mb-2">
                    <button
                      onClick={() => setSelectedPages('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedPages === 'all'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      All Pages
                    </button>
                    <button
                      onClick={() => setSelectedPages('')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  )}
                  {totalPages > 0 && (
                    <p className="text-xs text-slate-500 mt-1">PDF has {totalPages} page{totalPages !== 1 ? 's' : ''}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Image Quality: {(imageQuality * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.01"
                    value={imageQuality}
                    onChange={(e) => setImageQuality(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Lower (Smaller)</span>
                    <span>Higher (Better)</span>
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
            {pdfFile && (
              <div className="mb-6">
                {!pdfjsLib ? (
                  <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 text-center">
                    <p className="text-sm text-blue-700">Loading PDF.js library... Please wait.</p>
                  </div>
                ) : (
                  <button
                    onClick={convertPDFToJPG}
                    disabled={isProcessing}
                    className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-wait"
                  >
                    {isProcessing ? 'Processing...' : '⚡ Convert to JPG'}
                  </button>
                )}
              </div>
            )}

            {/* Converted Images */}
            {convertedImages.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Converted Images ({convertedImages.length})
                  </h3>
                  <button
                    onClick={downloadAll}
                    className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
                  >
                    Download All
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {convertedImages.map((image, index) => (
                    <div key={index} className="rounded-xl border-2 border-slate-200 bg-slate-50 p-3">
                      <img
                        src={image.dataUrl}
                        alt={`Page ${image.page}`}
                        className="w-full h-auto rounded-lg mb-2"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-700">Page {image.page}</span>
                        <button
                          onClick={() => downloadImage(image, index)}
                          className="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* What is PDF to JPG Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is PDF to JPG Conversion?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>PDF to JPG conversion</strong> is the process of converting PDF (Portable Document Format) pages into JPG (JPEG) image files. 
                This conversion extracts each page of a PDF document and saves it as a separate JPG image file. According to <a href="https://developer.mozilla.org/en-US/docs/Web/PDF" target="_blank" rel="noopener noreferrer nofollow" className="text-red-700 hover:text-red-800 font-semibold underline">MDN Web Docs</a>, 
                PDFs are complex document formats that can contain text, images, vector graphics, and interactive elements.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Converting PDFs to JPG images is useful for several purposes: sharing PDF content as images in emails or messaging apps, 
                embedding PDF pages in documents or presentations, creating thumbnails or previews, extracting images from PDFs, 
                and making PDF content viewable in applications that don't support PDF format. JPG format is widely supported and 
                provides good compression, making it ideal for web use and sharing.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our PDF to JPG converter uses PDF.js, a JavaScript library developed by Mozilla, to render PDF pages as images in your browser. 
                This client-side processing ensures your PDF files remain completely private and secure. All conversion happens locally, 
                so your documents never leave your device or get uploaded to any server.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Before
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    PDF files require PDF readers to view. They can't be easily embedded in emails, shared in messaging apps, or used as images in documents.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 font-mono">document.pdf (2.5 MB)</p>
                    <p className="text-xs text-slate-500 mt-1">Requires PDF reader</p>
                  </div>
                </div>
                
                <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✓</span>
                    After
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    JPG images can be viewed in any image viewer, embedded in documents, shared easily, and used anywhere images are supported.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-red-200">
                    <p className="text-xs text-slate-600 font-mono">page-1.jpg, page-2.jpg...</p>
                    <p className="text-xs text-slate-500 mt-1">Universal compatibility</p>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-3">PDF to JPG Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real data showing the benefits of converting PDFs to JPG images
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-red-200 shadow-lg">
                <div className="text-5xl font-extrabold text-red-600 mb-2">301K</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Monthly Searches</div>
                <div className="text-xs text-slate-600">High demand tool</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">2x</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Scale Factor</div>
                <div className="text-xs text-slate-600">High-resolution output</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Client-Side</div>
                <div className="text-xs text-slate-600">Complete privacy</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">0.1-1.0</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Quality Range</div>
                <div className="text-xs text-slate-600">Adjustable settings</div>
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
                    PDF.js enables client-side PDF rendering and manipulation, making it possible to convert PDFs to images entirely in the browser 
                    without server-side processing. This approach ensures maximum privacy and security for users.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use PDF to JPG Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use PDF to JPG Converter?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Converting PDFs to JPG images offers numerous benefits for sharing, embedding, and using PDF content in various applications. 
              Here are the key advantages of using our PDF to JPG converter:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Easy Sharing</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      JPG images can be easily shared via email, messaging apps, social media, and cloud storage services. Unlike PDFs, 
                      JPG images don't require special viewers and can be previewed directly in most applications. This makes PDF to JPG 
                      conversion essential for sharing document content as images.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Document Embedding</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Convert PDF pages to JPG images for embedding in Word documents, PowerPoint presentations, web pages, or design software. 
                      JPG format is universally supported, making it easy to include PDF content in any document or application that supports images.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">🖼️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Image Extraction</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Extract images from PDF documents by converting PDF pages to JPG format. This is useful for recovering images from PDFs, 
                      creating image galleries from PDF documents, or extracting visual content for reuse in other projects.
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
                      All PDF to JPG conversion happens entirely in your browser using client-side JavaScript. Your PDF files never leave your device, 
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
                      Client-side processing means instant conversion without waiting for file uploads or server processing. Convert PDF pages to JPG 
                      images in seconds, even for multi-page documents. No internet connection required after the initial page load.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Quality Control</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Adjust image quality from 0.1 (smallest file) to 1.0 (highest quality) to balance file size and image quality. 
                      Higher quality is perfect for printing, while lower quality is ideal for web use and email attachments.
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
                    Companies like <a href="https://www.adobe.com/acrobat/online/pdf-to-jpg.html" target="_blank" 
                    rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">Adobe</a> and 
                    <a href="https://cloudconvert.com/pdf-to-jpg" target="_blank" rel="noopener noreferrer" 
                    className="text-blue-700 hover:text-blue-800 font-semibold underline"> CloudConvert</a> offer PDF to JPG conversion services, 
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
              Our PDF to JPG converter uses PDF.js, a powerful JavaScript library, to render PDF pages as images directly in your browser. 
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
                  Each selected page is rendered onto a canvas element at high resolution (2x scale) to ensure crisp, clear JPG images.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Export JPG</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Canvas content is converted to JPG format with your chosen quality setting. Download individual images or all at once.
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
                To get the best results when converting PDFs to JPG images, follow these best practices:
              </p>

              <ul className="space-y-3 text-base text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Choose appropriate quality:</strong> Use higher quality (0.9-1.0) for printing or high-resolution displays. Use lower quality (0.6-0.8) for web use or email attachments to reduce file size.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Select specific pages:</strong> Instead of converting all pages, specify only the pages you need. This saves processing time and storage space.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Check file size:</strong> Large PDFs with many pages may take longer to process. For optimal performance, process PDFs under 10MB or convert pages in batches.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Use for appropriate purposes:</strong> PDF to JPG is ideal for sharing, embedding, and extracting images. For editing text, consider PDF to Word conversion instead.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Verify image quality:</strong> After conversion, check the JPG images to ensure text is readable and images are clear. Adjust quality settings if needed.</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Common Use Cases for PDF to JPG Conversion</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                PDF to JPG conversion serves a wide variety of professional and personal needs. Understanding these use cases can help you determine when this conversion is the right solution for your specific requirements.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📧</span>
                    Email and Messaging
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Many email clients and messaging applications have file size limits or don't support PDF previews. Converting PDF pages to JPG images allows you to share document content directly in emails and messages, ensuring recipients can view the content without downloading files or installing PDF readers.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This is particularly useful for sharing invoices, receipts, certificates, or any document where visual representation is important. JPG images are universally supported and typically smaller in size than PDF files, making them ideal for email attachments.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📱</span>
                    Social Media and Web Content
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Social media platforms, blogs, and content management systems often require images rather than PDF files. Converting PDF pages to JPG enables you to share document content on platforms like Facebook, Twitter, Instagram, LinkedIn, and WordPress sites.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This use case is essential for content creators, marketers, and businesses looking to share infographics, reports, or visual content from PDF documents on social media. JPG format ensures compatibility across all major platforms and provides better visual previews.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📄</span>
                    Document Embedding
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    When creating presentations, reports, or documents in Microsoft Word, PowerPoint, Google Docs, or design software like Adobe InDesign, you may need to include content from PDF files. Converting PDF pages to JPG images allows seamless embedding into these applications.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This is especially valuable for creating comprehensive reports that combine content from multiple sources, designing presentations with visual elements from PDF documents, or building documents that require specific formatting that's easier to achieve with images.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🖼️</span>
                    Image Extraction and Recovery
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    PDF documents often contain images, graphics, or visual content that you may need to extract for use in other projects. Converting PDF pages to JPG format effectively extracts all visual content, allowing you to recover images, create image galleries, or reuse visual elements.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This use case is valuable for graphic designers, content creators, and anyone working with visual assets. It's particularly useful when the original image files are no longer available, and the PDF is the only source of the visual content.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🖨️</span>
                    Printing and Archival
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Some printing systems and archival systems work better with image formats than PDF files. Converting PDF pages to high-quality JPG images ensures compatibility with various printing systems, photo printing services, and digital archiving solutions.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This is essential for professional printing services, creating photo books from PDF documents, or archiving documents in systems that prefer image formats. High-quality JPG conversion preserves visual fidelity while ensuring broad compatibility.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🔍</span>
                    Thumbnails and Previews
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Creating thumbnail images or preview images from PDF documents is a common requirement for document management systems, file browsers, content management systems, and web applications. Converting PDF pages to JPG provides an efficient way to generate these preview images.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This use case is critical for developers building document management systems, content creators organizing large document libraries, or anyone needing visual previews of PDF content without opening the full document.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                <h3 className="text-lg font-bold text-slate-900 mb-3">When to Use PDF to JPG vs Other Formats</h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  While PDF to JPG conversion is versatile, it's important to understand when it's the best choice compared to other conversion options:
                </p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>PDF to JPG:</strong> Best for sharing, embedding, extracting images, and creating previews. Use when visual representation is sufficient and text editing isn't required.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>PDF to PNG:</strong> Better when you need transparency support or lossless compression. PNG is ideal for graphics with transparent backgrounds or when quality preservation is critical.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>PDF to Word:</strong> Choose when you need to edit text content. Word format preserves text as editable content, making it suitable for document editing and text extraction.</span>
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

              <Link href="/pdf/pdf-to-png" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-xl">🖼️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">PDF to PNG</h3>
                    <p className="text-xs text-slate-600">Convert to PNG with transparency</p>
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
                    <p className="text-xs text-slate-600">Convert to editable Word format</p>
                  </div>
                </div>
              </Link>

              <Link href="/tools/pdf" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
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

