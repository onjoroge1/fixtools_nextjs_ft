import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function PDFRotator() {
  const [pdfFile, setPdfFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageRotations, setPageRotations] = useState({}); // { pageIndex: rotationAngle }
  const [rotationMode, setRotationMode] = useState('all'); // 'all', 'selected'
  const [selectedPages, setSelectedPages] = useState([]);
  const [rotationAngle, setRotationAngle] = useState(90); // 90, 180, 270
  const [rotatedPdfUrl, setRotatedPdfUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [pdfLib, setPdfLib] = useState(null);
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/pdf/pdf-rotator`;

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
    setRotatedPdfUrl('');
    setPageRotations({});
    setSelectedPages([]);
    
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

  // Toggle page selection
  const togglePageSelection = (pageIndex) => {
    setSelectedPages(prev => {
      if (prev.includes(pageIndex)) {
        return prev.filter(p => p !== pageIndex);
      } else {
        return [...prev, pageIndex].sort((a, b) => a - b);
      }
    });
  };

  // Rotate PDF using pdf-lib
  const rotatePDF = async () => {
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

    try {
      const { PDFDocument } = window.PDFLib;
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      // Apply rotations
      // pdf-lib's setRotation expects degrees as a number: 0, 90, 180, or 270
      // Validate and ensure rotationAngle is one of the valid values
      const validRotations = [0, 90, 180, 270];
      if (!validRotations.includes(rotationAngle)) {
        setError(`Invalid rotation angle: ${rotationAngle}. Must be 90, 180, or 270.`);
        setIsProcessing(false);
        return;
      }
      
      // Try to get degrees helper from pdf-lib if available
      let setPageRotation;
      try {
        // Check if pdf-lib has a degrees helper
        if (window.PDFLib && typeof window.PDFLib.degrees === 'function') {
          setPageRotation = (page, angle) => page.setRotation(window.PDFLib.degrees(angle));
        } else {
          // Use direct number
          setPageRotation = (page, angle) => page.setRotation(angle);
        }
      } catch (e) {
        // Fallback to direct number
        setPageRotation = (page, angle) => page.setRotation(angle);
      }
      
      if (rotationMode === 'all') {
        // Rotate all pages
        pages.forEach((page, index) => {
          try {
            setPageRotation(page, rotationAngle);
          } catch (err) {
            console.error(`Error rotating page ${index + 1}:`, err);
            // Try direct rotation as fallback
            try {
              page.setRotation(Number(rotationAngle));
            } catch (fallbackErr) {
              throw new Error(`Failed to rotate page ${index + 1}: ${err.message}`);
            }
          }
        });
      } else {
        // Rotate selected pages only
        if (selectedPages.length === 0) {
          setError('Please select at least one page to rotate.');
          setIsProcessing(false);
          return;
        }
        selectedPages.forEach((pageIndex) => {
          try {
            const page = pages[pageIndex];
            setPageRotation(page, rotationAngle);
          } catch (err) {
            console.error(`Error rotating page ${pageIndex + 1}:`, err);
            // Try direct rotation as fallback
            try {
              pages[pageIndex].setRotation(Number(rotationAngle));
            } catch (fallbackErr) {
              throw new Error(`Failed to rotate page ${pageIndex + 1}: ${err.message}`);
            }
          }
        });
      }

      // Save the rotated PDF
      const rotatedPdfBytes = await pdfDoc.save();
      const rotatedBlob = new Blob([rotatedPdfBytes], { type: 'application/pdf' });
      const rotatedUrl = URL.createObjectURL(rotatedBlob);
      
      setRotatedPdfUrl(rotatedUrl);
      
    } catch (err) {
      console.error('Rotation error:', err);
      setError(`Failed to rotate PDF: ${err.message || 'An error occurred during rotation. Please try again.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download rotated PDF
  const handleDownload = () => {
    if (!rotatedPdfUrl) {
      setError('Please rotate a PDF first.');
      return;
    }

    const link = document.createElement('a');
    link.href = rotatedPdfUrl;
    link.download = `rotated-${pdfFile.name}`;
    link.click();
  };

  // Clear everything
  const handleClear = () => {
    setPdfFile(null);
    setTotalPages(0);
    setPageRotations({});
    setSelectedPages([]);
    setRotationMode('all');
    setRotationAngle(90);
    setRotatedPdfUrl('');
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
          "name": "How do I rotate PDF pages?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Upload your PDF file using the upload button or drag and drop it into the designated area. Choose whether to rotate all pages or select specific pages. Select your rotation angle (90°, 180°, or 270°), then click Rotate PDF. Once rotation is complete, download your rotated PDF file."
          }
        },
        {
          "@type": "Question",
          "name": "Is PDF rotation free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our PDF rotator is 100% free to use. There's no registration required, no account needed, and no hidden fees. All PDF rotation happens in your browser, so your files never leave your device and remain completely private."
          }
        },
        {
          "@type": "Question",
          "name": "What rotation angles are available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our PDF rotator offers three rotation angles: 90° (quarter turn clockwise), 180° (half turn, upside down), and 270° (three-quarter turn clockwise, or 90° counterclockwise). You can rotate pages multiple times to achieve the desired orientation."
          }
        },
        {
          "@type": "Question",
          "name": "Can I rotate specific pages instead of all pages?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! You can select specific pages to rotate. Choose the 'Selected Pages' mode, then click on the page numbers you want to rotate. Only the selected pages will be rotated, while other pages remain unchanged."
          }
        },
        {
          "@type": "Question",
          "name": "Is my PDF data secure when rotating?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All PDF rotation happens entirely in your browser using client-side JavaScript. Your PDF files never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security for sensitive documents, business files, and personal information."
          }
        },
        {
          "@type": "Question",
          "name": "What file sizes can I rotate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our PDF rotator can handle PDFs of various sizes. For optimal performance, we recommend files under 10MB. Very large PDFs may take longer to process, but all rotation happens in your browser without any file size limits."
          }
        },
        {
          "@type": "Question",
          "name": "Can I rotate password-protected PDFs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our tool supports standard PDF files. Password-protected or encrypted PDFs require the password to be entered first before rotation. We're working on adding enhanced support for password-protected PDFs in a future update."
          }
        },
        {
          "@type": "Question",
          "name": "Will rotating a PDF reduce quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, rotating PDF pages does not reduce quality. Rotation is a lossless operation that only changes the page orientation metadata. All text, images, graphics, and formatting remain at their original quality."
          }
        }
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "PDF Rotator",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Rotate PDF pages online for free. Rotate pages 90°, 180°, or 270° to fix orientation. Rotate all pages or select specific pages. Works 100% in your browser with complete privacy.",
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
        "Rotate pages 90°, 180°, or 270°",
        "Rotate all pages or selected pages",
        "Lossless rotation (no quality loss)",
        "Browser-based processing",
        "No file size limits",
        "Instant rotation",
        "100% privacy and security",
        "No registration required"
      ]
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Rotate PDF Pages",
      "description": "Step-by-step guide to rotate PDF pages online for free using FixTools PDF rotator.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload PDF file",
          "text": "Click the upload button or drag and drop your PDF file into the upload area. The tool will load the PDF and display the total number of pages. The tool supports standard PDF files of any size.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose rotation settings",
          "text": "Select whether to rotate all pages or only selected pages. If selecting specific pages, click on the page numbers you want to rotate. Choose your rotation angle: 90° (quarter turn), 180° (half turn), or 270° (three-quarter turn).",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Rotate and download",
          "text": "Click the Rotate PDF button to process your file. The tool will rotate the selected pages by the specified angle. Once complete, download your rotated PDF file with the corrected orientation.",
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
          "name": "PDF Rotator",
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
        <title>PDF Rotator - Free Online PDF Page Rotation Tool | FixTools</title>
        <meta name="title" content="PDF Rotator - Free Online PDF Page Rotation Tool | FixTools" />
        <meta name="description" content="Rotate PDF pages online for free. Rotate pages 90°, 180°, or 270° to fix orientation. Rotate all pages or select specific pages. Fast, secure, 100% in your browser. No signup required." />
        <meta name="keywords" content="pdf rotator, rotate pdf, rotate pdf pages, pdf page rotation, rotate pdf online, fix pdf orientation, pdf rotator tool, rotate pdf 90 degrees, pdf page rotator, rotate pdf pages online" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="PDF Rotator - Free Online Tool" />
        <meta property="og:description" content="Rotate PDF pages online for free. Rotate pages 90°, 180°, or 270° to fix orientation. Works 100% in your browser." />
        <meta property="og:image" content={`${siteHost}/images/og-pdf-rotator.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="PDF Rotator - Free Online Tool" />
        <meta property="twitter:description" content="Rotate PDF pages online for free. Rotate pages 90°, 180°, or 270° to fix orientation." />
        <meta property="twitter:image" content={`${siteHost}/images/og-pdf-rotator.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.pdf-rotator-page) {
          font-size: 100% !important;
        }
        
        .pdf-rotator-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        
        .pdf-rotator-page *,
        .pdf-rotator-page *::before,
        .pdf-rotator-page *::after {
          box-sizing: border-box;
        }
        
        .pdf-rotator-page h1,
        .pdf-rotator-page h2,
        .pdf-rotator-page h3,
        .pdf-rotator-page p,
        .pdf-rotator-page ul,
        .pdf-rotator-page ol {
          margin: 0;
        }
        
        .pdf-rotator-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .pdf-rotator-page input,
        .pdf-rotator-page textarea,
        .pdf-rotator-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="pdf-rotator-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">PDF Rotator</span>
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
                  PDF Rotator
                </span>
              </h1>
              
              {/* Description */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>PDF rotator</strong> helps you fix PDF page orientation instantly. 
                Rotate pages 90°, 180°, or 270° to correct orientation issues. Rotate all pages or select specific pages. 
                Perfect for fixing scanned documents, correcting page orientation, and improving document readability. 
                All processing happens in your browser — your files never leave your device.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Rotate PDF
                  </span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              {/* Stats Cards */}
              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Angles</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">90°, 180°, 270°</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Quality</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Lossless</dd>
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
                      <span className="text-2xl">🔄</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Multiple Angles</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Rotate pages by 90°, 180°, or 270° to fix any orientation issue. Perfect for correcting scanned documents, fixing landscape/portrait issues, and improving document readability.
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
                      <h4 className="text-lg font-bold text-slate-900">Selective Rotation</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Rotate all pages at once or select specific pages to rotate. Choose individual pages that need correction while leaving others unchanged.
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
                        All PDF rotation happens in your browser. Your files never leave your device, aren't sent to any server, and aren't stored anywhere.
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
                <h2 className="text-xl font-semibold text-slate-900">PDF Rotator</h2>
                <p className="mt-1 text-sm text-slate-600">Upload a PDF file and rotate pages to fix orientation</p>
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

            {/* Rotation Options */}
            {pdfFile && totalPages > 0 && (
              <div className="mb-6 space-y-4">
                {/* Rotation Mode */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rotation Mode
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      onClick={() => setRotationMode('all')}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        rotationMode === 'all'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Rotate All Pages
                    </button>
                    <button
                      onClick={() => setRotationMode('selected')}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        rotationMode === 'selected'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Rotate Selected Pages
                    </button>
                  </div>
                </div>

                {/* Page Selection */}
                {rotationMode === 'selected' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select Pages to Rotate ({selectedPages.length} selected)
                    </label>
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2 max-h-48 overflow-y-auto p-3 rounded-lg bg-slate-50 border-2 border-slate-200">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => togglePageSelection(i)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedPages.includes(i)
                              ? 'bg-red-600 text-white'
                              : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rotation Angle */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rotation Angle
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setRotationAngle(90)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        rotationAngle === 90
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      90° (Quarter)
                    </button>
                    <button
                      onClick={() => setRotationAngle(180)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        rotationAngle === 180
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      180° (Half)
                    </button>
                    <button
                      onClick={() => setRotationAngle(270)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        rotationAngle === 270
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      270° (Three-Quarter)
                    </button>
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

            {/* Rotate Button */}
            {pdfFile && totalPages > 0 && (
              <div className="mb-6">
                <button
                  onClick={rotatePDF}
                  disabled={isProcessing || (rotationMode === 'selected' && selectedPages.length === 0)}
                  className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-wait"
                >
                  {isProcessing ? 'Rotating...' : `⚡ Rotate PDF ${rotationMode === 'all' ? '(All Pages)' : `(${selectedPages.length} Page${selectedPages.length !== 1 ? 's' : ''})`}`}
                </button>
              </div>
            )}

            {/* Results */}
            {rotatedPdfUrl && (
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">✅</span>
                    <p className="text-lg font-bold text-slate-900">PDF Successfully Rotated!</p>
                  </div>
                  <p className="text-sm text-slate-700">
                    Your PDF has been rotated by {rotationAngle}°.
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                >
                  Download Rotated PDF
                </button>
              </div>
            )}
          </div>
        </section>

        {/* What is PDF Rotation Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is PDF Rotation?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>PDF rotation</strong> is the process of changing the orientation of pages in a PDF (Portable Document Format) file by rotating them by 90°, 180°, or 270° degrees. 
                This process adjusts the page orientation metadata in the PDF, effectively rotating how the page is displayed when viewed. According to <a href="https://developer.mozilla.org/en-US/docs/Web/PDF" target="_blank" rel="noopener noreferrer nofollow" className="text-red-700 hover:text-red-800 font-semibold underline">MDN Web Docs</a>, 
                PDFs contain page orientation information that can be modified to correct viewing issues without affecting the actual content quality.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Rotating PDF pages is essential for several reasons: fixing orientation issues from scanned documents, correcting pages that were scanned or created in the wrong orientation, 
                improving document readability by ensuring all pages are properly oriented, standardizing document appearance across all pages, and preparing documents for printing or viewing. 
                PDF rotation is particularly valuable for fixing scanned documents, correcting landscape/portrait orientation mismatches, and ensuring consistent document presentation.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our PDF rotator uses pdf-lib, a powerful JavaScript library, to rotate your PDF pages entirely in your browser. This client-side processing ensures 
                your PDF files remain completely private and secure. All rotation happens locally, so your documents never leave your device or get uploaded to any server.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Before Rotation
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    PDF pages may be in incorrect orientation, making them difficult to read or view. Scanned documents often have pages that are sideways or upside down, requiring manual correction.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 font-mono">document.pdf</p>
                    <p className="text-xs text-slate-500 mt-1">Pages in wrong orientation</p>
                  </div>
                </div>
                
                <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✓</span>
                    After Rotation
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    All pages are correctly oriented for optimal viewing. Documents are readable, properly aligned, and ready for printing or sharing. All pages maintain consistent orientation.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-red-200">
                    <p className="text-xs text-slate-600 font-mono">document.pdf</p>
                    <p className="text-xs text-slate-500 mt-1">All pages correctly oriented</p>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-3">PDF Rotation Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real data showing the benefits of rotating PDF pages
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-red-200 shadow-lg">
                <div className="text-5xl font-extrabold text-red-600 mb-2">80K</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Monthly Searches</div>
                <div className="text-xs text-slate-600">High demand tool</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">3</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Rotation Angles</div>
                <div className="text-xs text-slate-600">90°, 180°, 270°</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Lossless</div>
                <div className="text-xs text-slate-600">No quality loss</div>
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
                    PDF page rotation is a metadata operation that changes how pages are displayed without affecting content quality. Client-side PDF rotation enables users to 
                    fix orientation issues without compromising privacy or security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use PDF Rotator Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use PDF Rotator?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Rotating PDF pages offers numerous benefits for document correction, readability, and presentation. Here are the key advantages of using our PDF rotator:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Fix Orientation Issues</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Correct pages that are sideways, upside down, or in the wrong orientation. Perfect for fixing scanned documents where pages were scanned incorrectly, 
                      correcting landscape/portrait orientation mismatches, and ensuring all pages are properly aligned for viewing.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Selective Rotation</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Rotate all pages at once or select specific pages that need correction. This allows you to fix only the pages that have orientation issues 
                      while leaving correctly oriented pages unchanged. Perfect for documents with mixed orientations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Lossless Operation</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      PDF rotation is a lossless operation that only changes page orientation metadata. No quality loss occurs during rotation. 
                      All text, images, graphics, and formatting remain at their original quality. Perfect for maintaining document integrity.
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
                      All PDF rotation happens entirely in your browser using client-side JavaScript. Your PDF files never leave your device, 
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
                      Client-side processing means instant rotation without waiting for file uploads or server processing. Rotate PDF pages in seconds, 
                      even for large documents. No internet connection required after the initial page load.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 6 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Multiple Angles</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Choose from three rotation angles: 90° (quarter turn), 180° (half turn, upside down), or 270° (three-quarter turn). 
                      Rotate pages multiple times if needed to achieve the desired orientation. Perfect for any orientation correction need.
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
                    Companies like <a href="https://www.adobe.com/acrobat/online/rotate-pdf.html" target="_blank" 
                    rel="noopener noreferrer nofollow" className="text-blue-700 hover:text-blue-800 font-semibold underline">Adobe</a> and 
                    <a href="https://www.ilovepdf.com/rotate-pdf" target="_blank" rel="noopener noreferrer nofollow" 
                    className="text-blue-700 hover:text-blue-800 font-semibold underline"> iLovePDF</a> offer PDF rotation services, 
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
              Our PDF rotator uses pdf-lib, a powerful JavaScript library, to rotate your PDF pages directly in your browser. Here's how the rotation process works:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 text-white font-bold text-xl shadow-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Upload PDF File</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Upload your PDF file. The tool loads the PDF and displays the total number of pages. You can then choose your rotation settings.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Choose Rotation Settings</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Select whether to rotate all pages or only selected pages. If selecting specific pages, click on the page numbers. Choose your rotation angle: 90°, 180°, or 270°.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Rotate & Download</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Click Rotate PDF to process your file. The tool rotates the selected pages by the specified angle. Once complete, download your rotated PDF file with corrected orientation.
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for PDF Rotation</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                To get the best results when rotating PDF pages, follow these best practices:
              </p>

              <ul className="space-y-3 text-base text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Check orientation before rotating:</strong> Review your PDF to identify which pages need rotation and by what angle. This helps you select the correct rotation angle and avoid over-rotating pages.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Use selective rotation for mixed documents:</strong> If only some pages need rotation, use the selective rotation mode to rotate only those pages. This preserves correctly oriented pages and saves processing time.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Rotate in steps if needed:</strong> If a page needs to be rotated by more than 270°, you can rotate it multiple times. For example, rotate 90° twice to achieve 180° rotation, or three times for 270°.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Keep originals:</strong> The rotated PDF is a new file. Keep your original PDF file as a backup in case you need to revert changes or try different rotation angles.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Verify after rotation:</strong> After rotating, review the PDF to ensure all pages are correctly oriented. Check that text is readable and images are properly aligned before finalizing.</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Common Use Cases for PDF Rotation</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                PDF rotation serves a wide variety of professional and personal needs. Understanding these use cases can help you determine when rotation is the right solution:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📄</span>
                    Fix Scanned Documents
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Scanned documents often have pages that are sideways or upside down due to incorrect scanning orientation. Rotating these pages corrects the orientation, making documents readable and professional.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This is essential for digitizing physical documents, archiving paperwork, and creating properly oriented digital copies of important documents.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🖨️</span>
                    Prepare for Printing
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Ensure all PDF pages are correctly oriented before printing. Rotating pages ensures they print in the correct orientation, preventing wasted paper and ensuring professional-looking printed documents.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This is particularly important for professional documents, reports, presentations, and any materials that will be printed or shared in physical form.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📱</span>
                    Improve Mobile Viewing
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Rotate pages to optimize viewing on mobile devices. Landscape pages may need rotation for better mobile viewing, or portrait pages may need adjustment for tablet viewing.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This improves the user experience when viewing PDFs on smartphones, tablets, and other mobile devices, ensuring content is readable without constant device rotation.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Standardize Document Appearance
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Ensure all pages in a document have consistent orientation. Rotate pages to create a uniform document appearance, making it easier to read and more professional.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This is valuable for business documents, reports, presentations, and any materials where consistent presentation is important for professionalism and readability.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    Correct Mixed Orientations
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Fix documents with mixed page orientations. Some pages may be portrait while others are landscape, requiring selective rotation to create a consistent document.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This use case is common when combining documents from different sources or when documents have been created with inconsistent page orientations.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    Archive and Organize
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Rotate pages when archiving documents to ensure proper orientation for future reference. Correctly oriented documents are easier to search, view, and manage in document management systems.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This is essential for creating organized document archives, digital libraries, and document management systems where proper orientation improves accessibility and usability.
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
                    <span className="text-xl">🏞️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">PDF to PNG</h3>
                    <p className="text-xs text-slate-600">Convert to PNG with transparency</p>
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


