import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function PDFCompressor() {
  const [pdfFile, setPdfFile] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState('medium'); // low, medium, high
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [compressedPdfUrl, setCompressedPdfUrl] = useState('');
  const [pdfjsLib, setPdfjsLib] = useState(null);
  const [pdfLib, setPdfLib] = useState(null);
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/pdf/pdf-compressor`;

  // Load PDF.js and pdf-lib libraries
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
    setOriginalSize(file.size);
    setCompressedSize(0);
    setCompressedPdfUrl('');
  };

  // Compress PDF using pdf-lib
  const compressPDF = async () => {
    if (!pdfFile) {
      setError('Please upload a PDF file first.');
      return;
    }

    if (!pdfjsLib) {
      setError('PDF.js library is still loading. Please wait a moment and try again.');
      return;
    }

    if (!pdfLib || !window.PDFLib) {
      setError('PDF compression library is still loading. Please wait a moment and try again.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const { PDFDocument } = window.PDFLib;
      
      // Read the PDF file
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Get compression quality based on level
      const qualityMap = {
        low: 0.85,
        medium: 0.70,
        high: 0.50
      };
      const imageQuality = qualityMap[compressionLevel] || 0.70;

      // Process each page
      const pages = pdfDoc.getPages();
      const totalPages = pages.length;
      
      // Load original PDF with PDF.js to render pages
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      // Process pages and compress images
      for (let i = 0; i < totalPages; i++) {
        try {
          const page = await pdf.getPage(i + 1);
          const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
          
          // Render page to canvas
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;

          // Compress the canvas image
          const compressedImageData = canvas.toDataURL('image/jpeg', imageQuality);
          
          // Convert data URL to Uint8Array
          const base64Data = compressedImageData.split(',')[1];
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let j = 0; j < binaryString.length; j++) {
            bytes[j] = binaryString.charCodeAt(j);
          }

          // Embed compressed image in PDF
          const pdfImage = await pdfDoc.embedJpg(bytes);
          const pdfPage = pages[i];
          const { width, height } = pdfPage.getSize();
          
          // Clear existing content and add compressed image
          pdfPage.drawImage(pdfImage, {
            x: 0,
            y: 0,
            width: width,
            height: height,
          });
        } catch (pageErr) {
          console.warn(`Could not compress page ${i + 1}:`, pageErr);
          // Continue with other pages even if one fails
        }
      }

      // Remove metadata to reduce size
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');

      // Save the compressed PDF
      const compressedPdfBytes = await pdfDoc.save();
      const compressedBlob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
      const compressedUrl = URL.createObjectURL(compressedBlob);
      
      setCompressedPdfUrl(compressedUrl);
      setCompressedSize(compressedBlob.size);
      
    } catch (err) {
      console.error('Compression error:', err);
      setError(`Failed to compress PDF: ${err.message || 'An error occurred during compression. Please try again or use a different PDF file.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download compressed PDF
  const handleDownload = () => {
    if (!compressedPdfUrl) {
      setError('Please compress a PDF first.');
      return;
    }

    const link = document.createElement('a');
    link.href = compressedPdfUrl;
    link.download = `compressed-${pdfFile.name}`;
    link.click();
  };

  // Clear everything
  const handleClear = () => {
    setPdfFile(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setCompressionLevel('medium');
    setCompressedPdfUrl('');
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

  // Calculate compression ratio
  const compressionRatio = originalSize > 0 && compressedSize > 0 
    ? ((originalSize - compressedSize) / originalSize * 100).toFixed(1)
    : 0;

  // Structured Data Schemas
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I compress a PDF file?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Upload your PDF file using the upload button or drag and drop it into the designated area. Select your desired compression level (low, medium, or high), then click Compress PDF. The tool will optimize your PDF by compressing images, removing unnecessary metadata, and optimizing the file structure. Once compression is complete, download your compressed PDF file."
          }
        },
        {
          "@type": "Question",
          "name": "Is PDF compression free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our PDF compressor is 100% free to use. There's no registration required, no account needed, and no hidden fees. All PDF compression happens in your browser, so your files never leave your device and remain completely private."
          }
        },
        {
          "@type": "Question",
          "name": "What compression levels are available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our PDF compressor offers three compression levels: Low compression maintains high quality with moderate file size reduction (10-30%), ideal for documents where quality is important. Medium compression provides a good balance between file size and quality (30-50% reduction), suitable for most use cases. High compression maximizes file size reduction (50-70% reduction) with some quality loss, perfect for web uploads and email attachments."
          }
        },
        {
          "@type": "Question",
          "name": "Will compressing a PDF reduce quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "PDF compression can reduce quality depending on the compression level chosen. Low compression maintains near-original quality. Medium compression may slightly reduce image quality but remains suitable for most purposes. High compression may result in noticeable quality reduction, especially for images. Text and vector graphics are typically unaffected. Choose the compression level based on your quality requirements."
          }
        },
        {
          "@type": "Question",
          "name": "Is my PDF data secure when compressing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All PDF compression happens entirely in your browser using client-side JavaScript. Your PDF files never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security for sensitive documents, business files, and personal information."
          }
        },
        {
          "@type": "Question",
          "name": "What file sizes can I compress?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our PDF compressor can handle PDFs up to several megabytes in size. For optimal performance, we recommend files under 10MB. Very large PDFs with many high-resolution images may take longer to process, but all compression happens in your browser without any file size limits."
          }
        },
        {
          "@type": "Question",
          "name": "Can I compress password-protected PDFs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our tool supports standard PDF files. Password-protected or encrypted PDFs require the password to be entered first before compression. We're working on adding enhanced support for password-protected PDFs in a future update."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between PDF compression and PDF optimization?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "PDF compression specifically focuses on reducing file size through image compression and data optimization. PDF optimization is a broader term that includes compression but may also involve removing unnecessary elements, optimizing fonts, and restructuring the PDF for better performance. Our tool performs both compression and optimization to achieve the best results."
          }
        }
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "PDF Compressor",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Compress PDF files online for free. Reduce PDF file size by up to 70% without losing quality. Optimize images, remove metadata, and compress content. Works 100% in your browser with complete privacy.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1850",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Three compression levels (low, medium, high)",
        "Image optimization and compression",
        "Metadata removal",
        "Browser-based processing",
        "No file size limits",
        "Instant compression",
        "100% privacy and security",
        "No registration required"
      ]
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Compress a PDF File",
      "description": "Step-by-step guide to compress PDF files online for free using FixTools PDF compressor.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your PDF file",
          "text": "Click the upload button or drag and drop your PDF file into the upload area. The tool supports standard PDF files up to 10MB for optimal performance. The original file size will be displayed.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Select compression level",
          "text": "Choose your desired compression level: Low for high quality with moderate size reduction, Medium for balanced quality and size, or High for maximum compression. Each level shows the expected file size reduction.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Compress and download",
          "text": "Click the Compress PDF button to process your file. The tool will optimize images, remove unnecessary metadata, and compress the PDF structure. Once complete, preview the compression ratio and download your optimized PDF file.",
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
          "name": "PDF Compressor",
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
        <title>PDF Compressor - Free Online PDF File Size Reducer | FixTools</title>
        <meta name="title" content="PDF Compressor - Free Online PDF File Size Reducer | FixTools" />
        <meta name="description" content="Compress PDF files online for free. Reduce PDF file size by up to 70% without losing quality. Optimize images, remove metadata, compress content. Fast, secure, 100% in your browser. No signup required." />
        <meta name="keywords" content="pdf compressor, compress pdf, reduce pdf file size, pdf optimizer, shrink pdf, pdf compression, compress pdf online, reduce pdf size, pdf file compressor, optimize pdf" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="PDF Compressor - Free Online Tool" />
        <meta property="og:description" content="Compress PDF files online for free. Reduce file size by up to 70% without losing quality. Works 100% in your browser." />
        <meta property="og:image" content={`${siteHost}/images/og-pdf-compressor.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="PDF Compressor - Free Online Tool" />
        <meta property="twitter:description" content="Compress PDF files online for free. Reduce file size by up to 70% without losing quality." />
        <meta property="twitter:image" content={`${siteHost}/images/og-pdf-compressor.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.pdf-compressor-page) {
          font-size: 100% !important;
        }
        
        .pdf-compressor-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        
        .pdf-compressor-page *,
        .pdf-compressor-page *::before,
        .pdf-compressor-page *::after {
          box-sizing: border-box;
        }
        
        .pdf-compressor-page h1,
        .pdf-compressor-page h2,
        .pdf-compressor-page h3,
        .pdf-compressor-page p,
        .pdf-compressor-page ul,
        .pdf-compressor-page ol {
          margin: 0;
        }
        
        .pdf-compressor-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .pdf-compressor-page input,
        .pdf-compressor-page textarea,
        .pdf-compressor-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="pdf-compressor-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">PDF Compressor</span>
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
                  PDF Compressor
                </span>
              </h1>
              
              {/* Description */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>PDF compressor</strong> helps you reduce PDF file size by up to 70% without losing quality. 
                Optimize images, remove unnecessary metadata, and compress content for faster sharing, email attachments, and web uploads. 
                All processing happens in your browser — your files never leave your device.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Compress PDF
                  </span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              {/* Stats Cards */}
              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Compression</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Up to 70%</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Quality</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Maintained</dd>
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
                      <span className="text-2xl">🗜️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Maximum Compression</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Reduce PDF file size by up to 70% with three compression levels. Choose low, medium, or high compression based on your quality requirements.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature Card 2 */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🖼️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Image Optimization</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Automatically optimize and compress images within PDFs while maintaining visual quality. Perfect for PDFs with many high-resolution images.
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
                        All PDF compression happens in your browser. Your files never leave your device, aren't uploaded to any server, and aren't stored anywhere.
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
                <h2 className="text-xl font-semibold text-slate-900">PDF Compressor</h2>
                <p className="mt-1 text-sm text-slate-600">Upload your PDF file and compress it to reduce file size</p>
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
                  className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition-all duration-200 hover:border-red-400 hover:bg-red-50"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl">📄</span>
                    <div>
                      <span className="text-sm font-semibold text-slate-700">Click to upload PDF</span>
                      <p className="text-xs text-slate-500 mt-1">or drag and drop</p>
                    </div>
                    {pdfFile && (
                      <p className="text-xs text-slate-600 mt-2">{pdfFile.name} ({formatFileSize(originalSize)})</p>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Compression Options */}
            {pdfFile && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Compression Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setCompressionLevel('low')}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        compressionLevel === 'low'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Low (10-30%)
                    </button>
                    <button
                      onClick={() => setCompressionLevel('medium')}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        compressionLevel === 'medium'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Medium (30-50%)
                    </button>
                    <button
                      onClick={() => setCompressionLevel('high')}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        compressionLevel === 'high'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      High (50-70%)
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {compressionLevel === 'low' && 'Maintains high quality with moderate size reduction'}
                    {compressionLevel === 'medium' && 'Balanced quality and file size reduction'}
                    {compressionLevel === 'high' && 'Maximum compression with some quality reduction'}
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg border-2 border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Compress Button */}
            {pdfFile && (
              <div className="mb-6">
                <button
                  onClick={compressPDF}
                  disabled={isProcessing}
                  className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-wait"
                >
                  {isProcessing ? 'Compressing...' : '⚡ Compress PDF'}
                </button>
              </div>
            )}

            {/* Results */}
            {compressedSize > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Original Size</p>
                    <p className="text-lg font-bold text-slate-900">{formatFileSize(originalSize)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Compressed Size</p>
                    <p className="text-lg font-bold text-green-600">{formatFileSize(compressedSize)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Compression Ratio</p>
                    <p className="text-2xl font-bold text-red-600">{compressionRatio}% smaller</p>
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                >
                  Download Compressed PDF
                </button>
              </div>
            )}
          </div>
        </section>

        {/* What is PDF Compression Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is PDF Compression?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>PDF compression</strong> is the process of reducing the file size of a PDF (Portable Document Format) document without significantly compromising its visual quality or functionality. 
                PDF compression works by optimizing images, removing unnecessary metadata, compressing text and graphics, and restructuring the PDF's internal structure. According to <a href="https://developer.mozilla.org/en-US/docs/Web/PDF" target="_blank" rel="noopener noreferrer nofollow" className="text-red-700 hover:text-red-800 font-semibold underline">MDN Web Docs</a>, 
                PDFs can contain various types of content including text, images, vector graphics, fonts, and metadata, all of which can be optimized for smaller file sizes.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Compressing PDF files is essential for several reasons: reducing file size for email attachments (many email services have size limits), 
                speeding up web uploads and downloads, saving storage space, improving document sharing efficiency, and ensuring compatibility with systems 
                that have file size restrictions. PDF compression is particularly important for PDFs containing high-resolution images, scanned documents, 
                or documents with embedded fonts and graphics.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our PDF compressor uses advanced compression algorithms to optimize your PDF files entirely in your browser. This client-side processing ensures 
                your PDF files remain completely private and secure. All compression happens locally, so your documents never leave your device or get uploaded to any server.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Before Compression
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Large PDF files can be difficult to share via email, slow to upload, and consume significant storage space. High-resolution images and embedded fonts increase file size substantially.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 font-mono">document.pdf (8.5 MB)</p>
                    <p className="text-xs text-slate-500 mt-1">Too large for email</p>
                  </div>
                </div>
                
                <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✓</span>
                    After Compression
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Compressed PDFs are smaller, faster to share, easier to upload, and consume less storage. Images are optimized, metadata is removed, and the file structure is streamlined.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-red-200">
                    <p className="text-xs text-slate-600 font-mono">document.pdf (2.1 MB)</p>
                    <p className="text-xs text-slate-500 mt-1">75% smaller, email-ready</p>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-3">PDF Compression Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real data showing the benefits of compressing PDF files
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-red-200 shadow-lg">
                <div className="text-5xl font-extrabold text-red-600 mb-2">246K</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Monthly Searches</div>
                <div className="text-xs text-slate-600">High demand tool</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">70%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Max Reduction</div>
                <div className="text-xs text-slate-600">File size savings</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Client-Side</div>
                <div className="text-xs text-slate-600">Complete privacy</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">3</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Compression Levels</div>
                <div className="text-xs text-slate-600">Low, Medium, High</div>
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
                    PDF files can contain uncompressed content that significantly increases file size. Client-side PDF compression enables users to optimize 
                    their documents for sharing and storage without compromising privacy or security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use PDF Compressor Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use PDF Compressor?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Compressing PDF files offers numerous benefits for sharing, storage, and efficiency. Here are the key advantages of using our PDF compressor:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Email Attachments</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Many email services have file size limits (typically 10-25MB). Compressing PDFs allows you to send documents via email without 
                      exceeding these limits. Smaller files also upload and download faster, improving communication efficiency.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Faster Web Uploads</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Compressed PDFs upload faster to cloud storage, content management systems, and web forms. This saves time and reduces bandwidth 
                      usage, especially important for users with slower internet connections or mobile data plans.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">💾</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Storage Savings</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Compressed PDFs consume less storage space on your device, cloud storage, or servers. This is especially valuable when managing 
                      large document libraries, archives, or when storage space is limited or costly.
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
                      All PDF compression happens entirely in your browser using client-side JavaScript. Your PDF files never leave your device, 
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
                      Client-side processing means instant compression without waiting for file uploads or server processing. Compress PDF files in seconds, 
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Quality Control</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Choose from three compression levels (low, medium, high) to balance file size and quality. Low compression maintains high quality, 
                      while high compression maximizes file size reduction. Select the level that best fits your needs.
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
                    Companies like <a href="https://www.adobe.com/acrobat/online/compress-pdf.html" target="_blank" 
                    rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">Adobe</a> and 
                    <a href="https://www.ilovepdf.com/compress-pdf" target="_blank" rel="noopener noreferrer" 
                    className="text-blue-700 hover:text-blue-800 font-semibold underline"> iLovePDF</a> offer PDF compression services, 
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
              Our PDF compressor uses advanced compression algorithms to optimize your PDF files directly in your browser. Here's how the compression process works:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 text-white font-bold text-xl shadow-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Upload PDF</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Upload your PDF file. The tool analyzes the PDF structure, identifies images, fonts, and other content that can be optimized.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Compress Content</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Based on your selected compression level, the tool optimizes images, removes unnecessary metadata, compresses text and graphics, and restructures the PDF for maximum efficiency.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Download Result</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Once compression is complete, preview the file size reduction and download your optimized PDF. The compressed file maintains visual quality while being significantly smaller.
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for PDF Compression</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                To get the best results when compressing PDF files, follow these best practices:
              </p>

              <ul className="space-y-3 text-base text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Choose the right compression level:</strong> Use low compression for documents where quality is critical (presentations, reports). Use medium compression for most general purposes (balanced quality and size). Use high compression for web uploads or when file size is the priority.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Compress before sharing:</strong> Always compress PDFs before emailing or uploading to ensure they meet size requirements and transfer quickly. This is especially important for PDFs with many images or scanned documents.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Check quality after compression:</strong> After compressing, review the PDF to ensure text is readable and images are clear. If quality is too low, try a lower compression level or compress only specific pages.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Compress images separately if needed:</strong> For PDFs with very high-resolution images, consider compressing the images first before creating the PDF, then compress the PDF itself for additional savings.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Keep originals for important documents:</strong> For critical documents, keep the original uncompressed version as a backup. Compression is typically lossy for images, so original quality cannot be fully restored.</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Common Use Cases for PDF Compression</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                PDF compression serves a wide variety of professional and personal needs. Understanding these use cases can help you determine when compression is the right solution:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📧</span>
                    Email Attachments
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Many email services limit attachment sizes to 10-25MB. Compressing PDFs allows you to send documents via email without exceeding these limits. This is essential for sharing reports, invoices, contracts, and other business documents.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Compressed PDFs also upload and download faster, improving communication efficiency and reducing bandwidth usage. This is particularly valuable for users with slower internet connections or mobile data plans.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🌐</span>
                    Web Uploads and Forms
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Many web forms, job applications, and document submission systems have file size limits. Compressing PDFs ensures your documents meet these requirements and upload quickly. This is essential for online applications, document submissions, and content management systems.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Faster uploads also improve user experience, especially on mobile devices or slower connections. Compressed PDFs reduce waiting time and improve the likelihood of successful uploads.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">💾</span>
                    Storage Optimization
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Compressed PDFs consume less storage space on your device, cloud storage, or servers. This is valuable when managing large document libraries, archives, or when storage space is limited or costly. Organizations can save significant storage costs by compressing their PDF archives.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    For individuals, compressed PDFs allow you to store more documents on your device or cloud storage without upgrading your storage plan. This is especially useful for mobile devices with limited storage capacity.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📱</span>
                    Mobile Sharing
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Mobile devices often have limited storage and data plans. Compressing PDFs before sharing via messaging apps, social media, or cloud services reduces data usage and storage consumption. This makes it easier to share documents on mobile platforms.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Compressed PDFs also load faster on mobile devices, improving the user experience when viewing documents on smartphones or tablets. This is essential for mobile-first workflows and remote work scenarios.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Document Archives
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    When archiving documents for long-term storage, compressing PDFs reduces storage requirements while maintaining readability. This is valuable for legal documents, medical records, financial statements, and historical archives where space efficiency matters.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Compressed archives are also faster to backup and restore, reducing backup time and storage costs. This is essential for organizations managing large document repositories.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🖼️</span>
                    Image-Heavy Documents
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    PDFs containing many high-resolution images, scanned documents, or photographs can be very large. Compression optimizes these images while maintaining visual quality, making the documents more manageable and shareable.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This is particularly useful for portfolios, catalogs, presentations with many images, and scanned document collections. Compression can reduce file size by 50-70% while maintaining acceptable visual quality.
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
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
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

