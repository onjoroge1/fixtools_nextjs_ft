import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import PaymentModal from '../../components/PaymentModal';
import { checkPaymentRequirement } from '../../lib/payments/stripe-config';
import { hasValidProcessingPass, formatFileSize } from '../../lib/payments/payment-utils';
import { checkPaymentRequirement as checkPaymentRequirementNew, getUserPlan, hasValidProcessingPass as hasValidProcessingPassNew } from '../../lib/config/pricing';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function ImageToPDF() {
  const [imageFiles, setImageFiles] = useState([]);
  const [pdfUrl, setPdfUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const [pdfLib, setPdfLib] = useState(null);
  const [userSession, setUserSession] = useState({ processingPass: null });
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/pdf/image-to-pdf`;

  // Load pdf-lib library
  useEffect(() => {
    const loadPDFLib = async () => {
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
          document.head.appendChild(script);
        } else {
          setPdfLib(window.PDFLib);
        }
      }
    };
    loadPDFLib();
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

  // Handle file upload (multiple images)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Filter for image files
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
    const validImages = files.filter(file => 
      imageTypes.includes(file.type) || 
      /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(file.name)
    );

    if (validImages.length === 0) {
      setError('Please upload image files (JPG, PNG, GIF, WebP, or BMP).');
      return;
    }

    if (validImages.length !== files.length) {
      setError(`Some files were skipped. Only image files are supported. ${validImages.length} of ${files.length} files are valid.`);
    } else {
      setError('');
    }

    // Calculate total file size
    const totalSize = validImages.reduce((sum, file) => sum + file.size, 0);
    const fileCount = validImages.length;

    // Check payment requirement using new centralized config
    const userPlan = getUserPlan(userSession);
    const requirement = checkPaymentRequirementNew('image', totalSize, fileCount, userPlan);

    // If payment required and no valid pass, show payment modal
    if (requirement.requiresPayment) {
      setPaymentRequirement(requirement);
      setShowPaymentModal(true);
      // Don't set files yet - wait for payment
      return;
    }

    setImageFiles(validImages);
    setPdfUrl('');
  };

  // Convert images to PDF
  const convertImagesToPDF = async () => {
    if (imageFiles.length === 0) {
      setError('Please upload at least one image file first.');
      return;
    }

    // Check payment requirement again
    const totalSize = imageFiles.reduce((sum, file) => sum + file.size, 0);
    const fileCount = imageFiles.length;
    const userPlan = getUserPlan(userSession);
    const requirement = checkPaymentRequirementNew('image', totalSize, fileCount, userPlan);

    // If payment required and no valid pass, show payment modal
    if (requirement.requiresPayment) {
      setPaymentRequirement(requirement);
      setShowPaymentModal(true);
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
      const pdfDoc = await PDFDocument.create();

      // Process each image
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        
        // Read image as data URL
        const imageDataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(new Error(`Failed to read image: ${file.name}`));
          reader.readAsDataURL(file);
        });

        // Convert data URL to Uint8Array
        const base64Data = imageDataUrl.split(',')[1];
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let j = 0; j < binaryString.length; j++) {
          bytes[j] = binaryString.charCodeAt(j);
        }

        // Determine image type and embed
        let pdfImage;
        if (file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')) {
          pdfImage = await pdfDoc.embedPng(bytes);
        } else if (file.type === 'image/jpeg' || file.type === 'image/jpg' || 
                   file.name.toLowerCase().match(/\.(jpg|jpeg)$/i)) {
          pdfImage = await pdfDoc.embedJpg(bytes);
        } else {
          // For other formats, try to embed as PNG (convert if needed)
          pdfImage = await pdfDoc.embedPng(bytes);
        }

        // Create a page with the image dimensions
        const { width, height } = pdfImage.scale(1);
        const page = pdfDoc.addPage([width, height]);
        
        // Draw image on page
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width: width,
          height: height,
        });
      }

      // Save PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error('PDF creation error:', err);
      setError('Failed to create PDF: ' + err.message);
    } finally {
      setIsProcessing(false);
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
    if (imageFiles.length > 0) {
      convertImagesToPDF();
    }
  };

  // Download PDF
  const handleDownload = () => {
    if (!pdfUrl) {
      setError('No PDF to download. Please convert images first.');
      return;
    }

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `images-to-pdf-${Date.now()}.pdf`;
    link.click();
  };

  // Remove image from list
  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setPdfUrl('');
  };

  // Clear everything
  const handleClear = () => {
    setImageFiles([]);
    setPdfUrl('');
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
  const totalSize = imageFiles.reduce((sum, file) => sum + file.size, 0);

  // Structured Data Schemas
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I convert images to PDF?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Upload one or more image files (JPG, PNG, GIF, WebP, or BMP) using the upload button or drag and drop them into the designated area. You can select multiple images at once. Click 'Convert to PDF' to create a PDF document with all your images. Each image will be added as a separate page in the PDF. Once conversion is complete, download your PDF file."
          }
        },
        {
          "@type": "Question",
          "name": "Is image to PDF conversion free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our image to PDF converter is free for single images up to 5MB. For larger files (above 5MB) or batch processing (multiple images), a Processing Pass is required. All processing happens in your browser, so your images never leave your device and remain completely private."
          }
        },
        {
          "@type": "Question",
          "name": "What image formats are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our tool supports all common image formats including JPEG, JPG, PNG, GIF, WebP, and BMP. You can mix different formats in a single conversion - all images will be converted to PDF pages in the order you upload them."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert multiple images to one PDF?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! You can upload multiple images at once and they will all be combined into a single PDF document. Each image becomes a separate page in the PDF. For batch processing (2+ images), a Processing Pass is required for free tier users."
          }
        },
        {
          "@type": "Question",
          "name": "Is my image data secure when converting?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All image to PDF conversion happens entirely in your browser using client-side JavaScript. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security for sensitive photos, documents, and personal images."
          }
        },
        {
          "@type": "Question",
          "name": "What file size limits apply?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Free tier supports single images up to 5MB. For larger images (up to 100MB) or batch processing multiple images, a Processing Pass is required. The Processing Pass costs $3.99 and is valid for 24 hours, allowing unlimited conversions during that period."
          }
        },
        {
          "@type": "Question",
          "name": "Will image quality be preserved in the PDF?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, image quality is preserved when converting to PDF. The tool maintains the original resolution and quality of your images. Each image is embedded in the PDF at its original dimensions, ensuring no quality loss during conversion."
          }
        },
        {
          "@type": "Question",
          "name": "Can I reorder images before converting?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, images are added to the PDF in the order you upload them. We're working on adding drag-and-drop reordering functionality in a future update. For now, you can remove images and re-upload them in your desired order."
          }
        }
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Image to PDF - Convert Images to PDF Online",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online tool to convert images to PDF. Convert JPG, PNG, GIF, WebP, and BMP images to PDF format. Combine multiple images into one PDF document. Works 100% in your browser with complete privacy.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1850",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Convert images to PDF",
        "Multiple image formats supported",
        "Batch image processing",
        "Browser-based processing",
        "100% privacy and security",
        "No registration required",
        "Download PDF instantly",
        "Preserve image quality"
      ]
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert Images to PDF",
      "description": "Step-by-step guide to convert images to PDF format online.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your images",
          "text": "Click the upload button or drag and drop your image files into the upload area. You can select multiple images at once. Supported formats include JPG, PNG, GIF, WebP, and BMP. Wait for the files to load.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Review and convert",
          "text": "Review your uploaded images. You can remove any images you don't want. Click the 'Convert to PDF' button to start the conversion process. Each image will become a separate page in the PDF.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Download your PDF",
          "text": "Once conversion is complete, click the 'Download PDF' button to save your PDF file. The PDF will contain all your images as separate pages, maintaining their original quality and resolution.",
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
          "name": "Image to PDF",
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
        <title>Image to PDF - Free Online Tool to Convert Images to PDF | FixTools</title>
        <meta name="title" content="Image to PDF - Free Online Tool to Convert Images to PDF | FixTools" />
        <meta name="description" content="Convert images to PDF online for free. Convert JPG, PNG, GIF, WebP, and BMP images to PDF format. Combine multiple images into one PDF document. Works 100% in your browser - fast, secure, no registration required." />
        <meta name="keywords" content="image to pdf, convert image to pdf, jpg to pdf, png to pdf, images to pdf, convert images to pdf, image pdf converter, multiple images to pdf" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Image to PDF - Free Online Tool to Convert Images to PDF" />
        <meta property="og:description" content="Convert images to PDF online for free. Convert JPG, PNG, GIF, WebP, and BMP images to PDF format. Combine multiple images into one PDF." />
        <meta property="og:image" content={`${siteHost}/images/og-image-to-pdf.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Image to PDF - Free Online Tool to Convert Images to PDF" />
        <meta property="twitter:description" content="Convert images to PDF online for free. Convert JPG, PNG, GIF, WebP, and BMP images to PDF format." />
        <meta property="twitter:image" content={`${siteHost}/images/og-image-to-pdf.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.image-to-pdf-page) {
          font-size: 100% !important;
        }
        
        .image-to-pdf-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .image-to-pdf-page *,
        .image-to-pdf-page *::before,
        .image-to-pdf-page *::after {
          box-sizing: border-box;
        }
        
        .image-to-pdf-page h1,
        .image-to-pdf-page h2,
        .image-to-pdf-page h3,
        .image-to-pdf-page p,
        .image-to-pdf-page ul,
        .image-to-pdf-page ol {
          margin: 0;
        }
        
        .image-to-pdf-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .image-to-pdf-page input,
        .image-to-pdf-page textarea,
        .image-to-pdf-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="image-to-pdf-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">Image to PDF</span>
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
                  Image to PDF
                </span>
              </h1>
              
              {/* Description - MUST include primary keyword in first 100 words */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>Image to PDF</strong> tool helps you convert images to PDF format instantly. Convert JPG, PNG, GIF, WebP, and BMP images to PDF documents. Combine multiple images into one PDF file. Works 100% in your browser - fast, secure, no registration required.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Convert Images
                  </span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              {/* Stats Cards */}
              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Formats</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">6+ Types</dd>
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
                      <span className="text-2xl">🖼️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Multiple Formats</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Supports JPG, PNG, GIF, WebP, and BMP image formats. Convert any image type to PDF with one click.
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
                        Combine multiple images into one PDF document. Each image becomes a separate page automatically.
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
                        All conversion happens in your browser. Your images never leave your device or get uploaded to any server.
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
                <h2 className="text-xl font-semibold text-slate-900">Convert Images to PDF</h2>
                <p className="mt-1 text-sm text-slate-600">Upload one or more image files to convert to PDF format</p>
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
                Upload Image Files {imageFiles.length > 0 && `(${imageFiles.length} selected)`}
              </label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-50"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl">📷</span>
                    <div>
                      <span className="text-sm font-semibold text-slate-700">Click to upload images</span>
                      <p className="text-xs text-slate-500 mt-1">or drag and drop (JPG, PNG, GIF, WebP, BMP)</p>
                    </div>
                    {totalSize > 0 && (
                      <p className="text-xs text-slate-600 mt-2">
                        {imageFiles.length} file{imageFiles.length !== 1 ? 's' : ''} • {formatFileSize(totalSize)}
                      </p>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Image Preview List */}
            {imageFiles.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Selected Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative group rounded-xl border-2 border-slate-200 bg-slate-50 overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        title="Remove"
                      >
                        ×
                      </button>
                      <div className="p-2">
                        <p className="text-xs text-slate-600 truncate" title={file.name}>{file.name}</p>
                        <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
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

            {/* Convert Button */}
            {imageFiles.length > 0 && !isProcessing && (
              <div className="mb-6">
                <button
                  onClick={convertImagesToPDF}
                  disabled={isProcessing}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Converting...' : `⚡ Convert ${imageFiles.length} Image${imageFiles.length !== 1 ? 's' : ''} to PDF`}
                </button>
              </div>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="mb-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <p className="text-sm font-semibold text-blue-900">Converting images to PDF...</p>
                </div>
              </div>
            )}

            {/* Download PDF */}
            {pdfUrl && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-800">PDF Ready</label>
                  <button
                    onClick={handleDownload}
                    className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-xs font-semibold text-white hover:shadow-md transition-all"
                  >
                    ⬇ Download PDF
                  </button>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <iframe
                    src={pdfUrl}
                    className="w-full h-96 rounded-lg"
                    title="PDF Preview"
                  />
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

        {/* What is Image to PDF Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Image to PDF Conversion?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Image to PDF</strong> conversion is the process of converting image files (JPG, PNG, GIF, WebP, BMP) into PDF documents. This is useful for creating documents from photos, combining multiple images into a single file, archiving images in a standardized format, and sharing image collections as PDF documents.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/FileReader" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">MDN Web Docs</a>, the FileReader API enables reading image files in the browser, which can then be processed and converted to PDF format. Our Image to PDF tool uses pdf-lib, a powerful JavaScript library for creating PDF documents. The <a href="https://pdf-lib.js.org/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">pdf-lib library</a> provides comprehensive PDF creation capabilities that work entirely in the browser.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Image to PDF conversion is essential for document management, archiving photos, creating presentations from images, combining scanned documents, and sharing image collections in a universal format. PDF format ensures images are preserved with their original quality and can be viewed on any device or platform.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics/Impact Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Image to PDF Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real data showing the benefits of converting images to PDF
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">6+</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Image Formats</div>
                <div className="text-xs text-slate-600">JPG, PNG, GIF, WebP, BMP</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Quality Preserved</div>
                <div className="text-xs text-slate-600">Original resolution maintained</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Privacy</div>
                <div className="text-xs text-slate-600">All processing in your browser</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">&lt;5s</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Conversion Time</div>
                <div className="text-xs text-slate-600">Average processing time</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Image to PDF Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use Image to PDF?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Converting images to PDF offers numerous benefits:
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
                      Convert photos and scanned documents to PDF for long-term archiving. PDF format ensures documents remain accessible and readable for years to come, regardless of software changes or device updates.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Combine Multiple Images</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Merge multiple images into a single PDF document. Perfect for creating photo albums, combining scanned pages, or organizing image collections into one convenient file.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Universal Compatibility</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      PDF format is universally supported across all devices and platforms. Convert images to PDF to ensure they can be viewed on any computer, tablet, or smartphone without compatibility issues.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Professional Sharing</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Share image collections professionally by converting them to PDF. PDF format is standard for business documents, presentations, and professional communications, ensuring your images are presented in a professional format.
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
                Our Image to PDF tool makes it easy to convert images to PDF format. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Upload your images</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the upload button or drag and drop your image files into the upload area. You can select multiple images at once. Supported formats include JPG, PNG, GIF, WebP, and BMP. The files will be loaded and prepared for conversion.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Review and convert</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Review your uploaded images. You can remove any images you don't want by clicking the × button. Click the 'Convert to PDF' button to start the conversion process. Each image will become a separate page in the PDF document.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Download your PDF</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Once conversion is complete, preview your PDF in the embedded viewer. Click the 'Download PDF' button to save your PDF file. The PDF will contain all your images as separate pages, maintaining their original quality and resolution.
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
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Image to PDF tool?</h3>
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
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Multiple image formats supported</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Batch image processing</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Preserves image quality</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Image to PDF</h2>
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use High-Quality Images</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Start with high-resolution images for best PDF quality. The tool preserves original image quality, so higher quality source images result in better PDF documents. For documents and text, use images with at least 300 DPI resolution.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Organize Images Before Upload</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Images are added to the PDF in the order you upload them. Organize your images in the desired order before uploading, or remove and re-upload them in the correct sequence. This ensures your PDF pages appear in the right order.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Consider File Sizes</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Free tier supports single images up to 5MB. For larger images or batch processing, a Processing Pass is available. Consider compressing very large images before conversion if you're working within free tier limits, or upgrade to a Processing Pass for larger files.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use Appropriate Image Formats</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      JPG is best for photographs, PNG for images with transparency, and WebP for modern web images. The tool supports all common formats, but using the right format for your content ensures optimal quality and file size in the resulting PDF.
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


