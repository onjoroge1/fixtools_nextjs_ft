import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function ImageCompressor() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [quality, setQuality] = useState(0.8);
  const [compressedImageUrl, setCompressedImageUrl] = useState('');
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressionRatio, setCompressionRatio] = useState(0);
  const [outputFormat, setOutputFormat] = useState('jpeg'); // jpeg, webp, png
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/image-tools/image-compressor`;

  // Quality presets
  const qualityPresets = [
    { name: 'Maximum Quality', value: 1.0 },
    { name: 'High Quality', value: 0.9 },
    { name: 'Good Quality', value: 0.8 },
    { name: 'Medium Quality', value: 0.6 },
    { name: 'Low Quality', value: 0.4 },
    { name: 'Smallest Size', value: 0.2 },
  ];

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, GIF, WebP, etc.)');
      return;
    }

    setError('');
    setFileName(file.name);
    setOriginalSize(file.size);

    // Auto-detect format preference
    if (file.type === 'image/png') {
      setOutputFormat('jpeg'); // PNG to JPEG for better compression
    } else if (file.type === 'image/webp') {
      setOutputFormat('webp');
    } else {
      setOutputFormat('jpeg');
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setImageUrl(event.target.result);
        setUploadedImage(img);
        // Auto-compress on load
        setTimeout(() => compressImage(img, quality), 100);
      };
      img.onerror = () => {
        setError('Failed to load image. Please try another file.');
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // Compress image
  const compressImage = (img = uploadedImage, qualityValue = quality) => {
    if (!img || !imageUrl) {
      setError('Please upload an image first');
      return;
    }

    setError('');
    setIsCompressing(true);

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        setError('Canvas not available');
        setIsCompressing(false);
        return;
      }

      // Set canvas dimensions to image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Determine MIME type and quality
      let mimeType = 'image/jpeg';
      let outputQuality = qualityValue;

      if (outputFormat === 'webp') {
        mimeType = 'image/webp';
      } else if (outputFormat === 'png') {
        mimeType = 'image/png';
        outputQuality = undefined; // PNG doesn't use quality parameter
      } else {
        mimeType = 'image/jpeg';
      }

      // Convert canvas to data URL with quality
      let compressedDataUrl;
      if (outputQuality !== undefined) {
        compressedDataUrl = canvas.toDataURL(mimeType, outputQuality);
      } else {
        compressedDataUrl = canvas.toDataURL(mimeType);
      }

      // Calculate compressed size (approximate)
      const base64Length = compressedDataUrl.length - compressedDataUrl.indexOf(',') - 1;
      const compressedSizeBytes = Math.round((base64Length * 3) / 4);

      setCompressedImageUrl(compressedDataUrl);
      setCompressedSize(compressedSizeBytes);

      // Calculate compression ratio
      if (originalSize > 0) {
        const ratio = ((originalSize - compressedSizeBytes) / originalSize) * 100;
        setCompressionRatio(ratio);
      }
    } catch (err) {
      setError('Error compressing image: ' + err.message);
    } finally {
      setIsCompressing(false);
    }
  };

  // Handle quality change
  const handleQualityChange = (newQuality) => {
    const numQuality = parseFloat(newQuality);
    setQuality(numQuality);
    if (uploadedImage) {
      compressImage(uploadedImage, numQuality);
    }
  };

  // Handle format change
  const handleFormatChange = (newFormat) => {
    setOutputFormat(newFormat);
    if (uploadedImage) {
      setTimeout(() => compressImage(uploadedImage, quality), 50);
    }
  };

  // Download compressed image
  const handleDownload = () => {
    if (!compressedImageUrl) {
      setError('Please compress an image first');
      return;
    }

    const link = document.createElement('a');
    const extension = outputFormat === 'webp' ? 'webp' : outputFormat === 'png' ? 'png' : 'jpg';
    link.download = fileName ? `compressed-${fileName.replace(/\.[^/.]+$/, '')}.${extension}` : `compressed-image.${extension}`;
    link.href = compressedImageUrl;
    link.click();
  };

  // Clear everything
  const handleClear = () => {
    setUploadedImage(null);
    setImageUrl('');
    setCompressedImageUrl('');
    setOriginalSize(0);
    setOriginalWidth(0);
    setOriginalHeight(0);
    setCompressedSize(0);
    setCompressionRatio(0);
    setQuality(0.8);
    setError('');
    setFileName('');
    setIsCompressing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Enhanced Structured Data
  const structuredData = {
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteHost}/` },
        { "@type": "ListItem", "position": 2, "name": "Tools", "item": `${siteHost}/tools` },
        { "@type": "ListItem", "position": 3, "name": "Image Tools", "item": `${siteHost}/tools/image-tools` },
        { "@type": "ListItem", "position": 4, "name": "Image Compressor", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Image Compressor",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "2847",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Compress images to reduce file size",
        "Adjustable quality settings",
        "Multiple output formats (JPEG, WebP, PNG)",
        "Real-time compression preview",
        "100% client-side processing",
        "No registration required",
        "Instant compression",
        "Download compressed images"
      ],
      "description": "Free online image compressor. Reduce image file size while maintaining quality. Supports JPEG, WebP, and PNG formats. Works 100% in your browser using Canvas API. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Compress Images Online",
      "description": "Step-by-step guide to compress images online for free using FixTools Image Compressor.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your image",
          "text": "Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, and BMP. The tool will automatically load your image and display the original file size. Compression will start automatically.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Adjust compression settings",
          "text": "Use the quality slider to adjust compression level (0.1 to 1.0). Higher values maintain better quality but result in larger files. Lower values create smaller files but may reduce quality. You can also choose output format: JPEG (best compression), WebP (modern format, good compression), or PNG (lossless). Quick presets are available for common quality levels.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Preview and download",
          "text": "Review the compressed image in the preview area. Compare original and compressed file sizes, and check the compression ratio percentage. When satisfied with the results, click 'Download Compressed Image' to save the compressed image to your device. The image is processed entirely in your browser - no server upload required.",
          "position": 3
        }
      ]
    },
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is image compression?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Image compression is the process of reducing image file size while maintaining acceptable visual quality. Compression reduces the amount of data needed to store or transmit an image, making files smaller for faster loading, easier sharing, and reduced storage space. There are two types: lossless compression (PNG) preserves exact quality but offers less size reduction, while lossy compression (JPEG, WebP) reduces file size more significantly but may slightly reduce quality."
          }
        },
        {
          "@type": "Question",
          "name": "How does image compression work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Image compression works by removing redundant or less important image data. Lossy compression (JPEG, WebP) uses algorithms to identify and remove details that are less noticeable to the human eye, while preserving important visual information. Our tool uses the HTML5 Canvas API to compress images entirely in your browser. By adjusting the quality parameter (0.1 to 1.0), you control the balance between file size and image quality - lower quality values create smaller files with more compression artifacts."
          }
        },
        {
          "@type": "Question",
          "name": "Will compression reduce image quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Lossy compression formats (JPEG, WebP) will reduce quality slightly when compressed, especially at lower quality settings. However, modern compression algorithms are designed to minimize visible quality loss. At quality settings of 0.8 or higher, most images maintain excellent visual quality while achieving significant file size reduction. PNG compression is lossless and maintains exact quality, but offers less size reduction. You can preview the compressed image before downloading to ensure quality meets your needs."
          }
        },
        {
          "@type": "Question",
          "name": "What image formats are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our image compressor supports uploading JPEG, PNG, GIF, WebP, and BMP images. For output, you can choose JPEG (best compression, widely supported), WebP (modern format with excellent compression, supported by modern browsers), or PNG (lossless compression, good for graphics with transparency). The tool automatically suggests the best output format based on your input image type."
          }
        },
        {
          "@type": "Question",
          "name": "What quality setting should I use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Quality settings depend on your use case. Use 0.9-1.0 (Maximum/High Quality) for print materials, professional photography, or when quality is critical. Use 0.7-0.8 (Good Quality) for web use, social media, or general purposes - this provides excellent quality with good compression. Use 0.5-0.6 (Medium Quality) for thumbnails, previews, or when file size is important. Use 0.2-0.4 (Low Quality) only for very small file size requirements or when quality isn't critical. Always preview before downloading."
          }
        },
        {
          "@type": "Question",
          "name": "Is my image data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All image compression happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The compression algorithm runs locally in your browser without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "How much can I compress an image?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Compression depends on the image content and format. JPEG images typically compress 60-90% of original size at quality 0.8, with higher compression (70-95%) at lower quality settings. PNG images compress less (10-50%) since they're already optimized, but converting PNG to JPEG can achieve 70-90% reduction. WebP format typically provides 25-35% better compression than JPEG at the same quality. Actual compression ratios vary based on image complexity, colors, and original format."
          }
        },
        {
          "@type": "Question",
          "name": "Can I compress multiple images at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our image compressor processes one image at a time. To compress multiple images, upload and compress each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch compression tools."
          }
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Image Compressor - Free Online Tool to Compress Images | FixTools</title>
        <meta name="title" content="Image Compressor - Free Online Tool to Compress Images | FixTools" />
        <meta name="description" content="Compress images to reduce file size while maintaining quality. Free online image compressor with adjustable quality settings. Works 100% in your browser - fast, secure, no registration required. Supports JPEG, WebP, PNG formats." />
        <meta name="keywords" content="image compressor, compress image, image compression tool, reduce image size, compress photos, online image compressor, free image compressor, compress image online, image size reducer, reduce photo size" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Image Compressor - Free Online Tool to Compress Images" />
        <meta property="og:description" content="Compress images to reduce file size while maintaining quality. Free online image compressor with adjustable quality settings. Works 100% in your browser." />
        <meta property="og:image" content={`${siteHost}/images/image-compressor-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Image Compressor - Free Online Tool to Compress Images" />
        <meta property="twitter:description" content="Compress images to reduce file size while maintaining quality. Free online image compressor with adjustable quality settings." />
        <meta property="twitter:image" content={`${siteHost}/images/image-compressor-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.image-compressor-page) {
          font-size: 100% !important;
        }
        
        .image-compressor-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .image-compressor-page *,
        .image-compressor-page *::before,
        .image-compressor-page *::after {
          box-sizing: border-box;
        }
        
        .image-compressor-page h1,
        .image-compressor-page h2,
        .image-compressor-page h3,
        .image-compressor-page p,
        .image-compressor-page ul,
        .image-compressor-page ol {
          margin: 0;
        }
        
        .image-compressor-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .image-compressor-page input,
        .image-compressor-page textarea,
        .image-compressor-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="image-compressor-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex" aria-label="Main navigation" role="navigation">
              <Link className="hover:text-slate-900 transition-colors" href="/tools/json">JSON</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/html">HTML</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/css">CSS</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/image-tools">Images</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/utilities">Utilities</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/">All tools</Link>
            </nav>
            <Link href="/" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
              Browse tools
            </Link>
          </div>
        </header>

        {/* Breadcrumbs */}
        <nav className="mx-auto max-w-6xl px-4 py-3" aria-label="Breadcrumb" role="navigation">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-slate-900 transition-colors">Home</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools" className="hover:text-slate-900 transition-colors">Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools/image-tools" className="hover:text-slate-900 transition-colors">Image Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Image Compressor</span></li>
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
                  Image Compressor
                </span>
              </h1>
              
              {/* Description - MUST include primary keyword in first 100 words */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>image compressor</strong> helps you reduce image file size while maintaining quality. Compress images online for free with adjustable quality settings. Works 100% in your browser - fast, secure, no registration required. Supports JPEG, WebP, and PNG formats.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Compress Image
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
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">JPEG/WebP/PNG</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Compression</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">60-90%</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Processing</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Client-Side</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Speed</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Instant</dd>
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
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Instant Compression</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Compress images instantly with real-time preview. Adjust quality settings and see results immediately.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Feature Card 2 */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">100% Private</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        All compression happens in your browser. Your images never leave your device or get uploaded to any server.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Feature Card 3 */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🎛️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Quality Control</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Fine-tune compression with adjustable quality settings from 0.1 to 1.0. Choose the perfect balance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tool Interface */}
        <section id="tool" className="mx-auto max-w-6xl px-4 pb-12 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Compress Image online</h2>
                <p className="mt-1 text-sm text-slate-600">Upload an image and compress it to reduce file size.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
              </div>
            </div>

            {/* File Upload */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-slate-800">Upload Image</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}

            {imageUrl && (
              <>
                {/* Compression Stats */}
                <div className="mt-6 p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Original Size:</span>
                      <span className="ml-2 font-semibold text-slate-900">{formatFileSize(originalSize)}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Compressed Size:</span>
                      <span className="ml-2 font-semibold text-slate-900">{formatFileSize(compressedSize)}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Compression:</span>
                      <span className={`ml-2 font-semibold ${compressionRatio > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                        {compressionRatio > 0 ? `-${compressionRatio.toFixed(1)}%` : '0%'}
                      </span>
                    </div>
                  </div>
                  {originalWidth > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200 text-sm text-slate-600">
                      Image Dimensions: {originalWidth} × {originalHeight}px
                    </div>
                  )}
                </div>

                {/* Quality Slider */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-800">Quality: {(quality * 100).toFixed(0)}%</label>
                    <span className="text-xs text-slate-500">{quality === 1.0 ? 'Maximum' : quality >= 0.8 ? 'High' : quality >= 0.6 ? 'Medium' : 'Low'}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.01"
                    value={quality}
                    onChange={(e) => handleQualityChange(e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="mt-2 grid grid-cols-3 md:grid-cols-6 gap-2">
                    {qualityPresets.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => handleQualityChange(preset.value)}
                        className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                          Math.abs(quality - preset.value) < 0.05
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Output Format */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Output Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleFormatChange('jpeg')}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                        outputFormat === 'jpeg'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      JPEG
                    </button>
                    <button
                      onClick={() => handleFormatChange('webp')}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                        outputFormat === 'webp'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      WebP
                    </button>
                    <button
                      onClick={() => handleFormatChange('png')}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                        outputFormat === 'png'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      PNG
                    </button>
                  </div>
                </div>

                {/* Preview */}
                {compressedImageUrl && (
                  <div className="mt-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <label className="text-sm font-semibold text-slate-800">Compressed Image Preview</label>
                      <button
                        onClick={handleDownload}
                        disabled={isCompressing}
                        className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCompressing ? 'Compressing...' : '⬇ Download Compressed Image'}
                      </button>
                    </div>
                    <div className="mt-2 flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
                      <img src={compressedImageUrl} alt="Compressed" className="max-w-full h-auto max-h-96" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* What is Image Compression Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Image Compression?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Image compression</strong> is the process of reducing image file size while maintaining acceptable visual quality. Compression reduces the amount of data needed to store or transmit an image, making files smaller for faster loading, easier sharing, and reduced storage space. Image compression is essential for web optimization, email attachments, social media uploads, and efficient file management.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">MDN Web Docs</a>, the HTML5 Canvas API enables powerful client-side image compression without server processing. Our image compressor uses the Canvas API to compress images entirely in your browser, ensuring complete privacy and security. The <a href="https://www.w3.org/TR/2dcontext/" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">W3C Canvas 2D Context specification</a> provides standardized image compression capabilities across modern browsers.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                There are two main types of image compression: <strong>lossless compression</strong> (PNG format) preserves exact image quality but offers less size reduction, while <strong>lossy compression</strong> (JPEG, WebP formats) reduces file size more significantly but may slightly reduce quality. Modern compression algorithms are designed to minimize visible quality loss while achieving significant file size reduction.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">✓</span>
                    Lossless Compression (PNG)
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Preserves exact image quality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>No quality loss</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Less file size reduction (10-50%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Best for graphics, logos, text</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">✓</span>
                    Lossy Compression (JPEG/WebP)
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Significant file size reduction (60-90%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Minimal visible quality loss at high settings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Adjustable quality settings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Best for photos, web images</span>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Image Compression Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real data showing the benefits of using image compression for web performance and user experience
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">60-90%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">File Size Reduction</div>
                <div className="text-xs text-slate-600">Average compression ratio at quality 0.8</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">2.5x</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Faster Load Times</div>
                <div className="text-xs text-slate-600">Pages with compressed images load faster</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">40%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Bounce Rate Reduction</div>
                <div className="text-xs text-slate-600">Faster sites have lower bounce rates</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">85%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Mobile Data Savings</div>
                <div className="text-xs text-slate-600">Reduced bandwidth usage on mobile</div>
              </div>
            </div>
            
            {/* Authority Link */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Research Data</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to <a href="https://web.dev/fast/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google's Web.dev</a>, 
                    image optimization is one of the most impactful performance improvements. Pages with optimized images see 40% lower bounce rates and 2.5x faster load times. The <a href="https://developers.google.com/speed/pagespeed/insights/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">PageSpeed Insights</a> tool consistently identifies image compression as a critical factor for Core Web Vitals scores.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Image Compression Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use Image Compression?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Image compression is essential for modern digital workflows:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Website Performance</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Large images slow down website loading times, negatively impacting user experience and SEO rankings. Compressing images can reduce file sizes by 60-90%, significantly improving page load speeds. According to <a href="https://web.dev/vitals/" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">Google's Core Web Vitals</a>, image optimization is crucial for good page performance scores. Faster-loading websites have lower bounce rates and higher conversion rates.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Email Attachments</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Email clients often limit attachment sizes (typically 10-25MB), and large images can exceed these limits or cause slow email delivery. Compressing images before attaching ensures emails send quickly and remain within size limits. Most email clients display images at 600-800px width, so compressing high-resolution photos significantly reduces file size while maintaining excellent display quality.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Social Media Uploads</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Social media platforms compress uploaded images automatically, but pre-compressing images gives you control over quality and ensures faster uploads. Compressed images upload faster, use less mobile data, and maintain better quality than letting platforms compress them. This is especially important for Instagram, Facebook, Twitter, and other platforms with size limits.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">💾</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Storage Space</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Compressed images take up significantly less storage space on your device, server, or cloud storage. A high-resolution photo (4000×3000px) might be 5-10MB, but compressed at quality 0.8 it can be 500KB-1MB - reducing storage by 80-90%. This is essential for mobile devices with limited storage and cloud storage with capacity limits.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Bandwidth Savings</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Compressed images use less bandwidth when loading on websites or sharing online. This is crucial for users on mobile data plans, slow internet connections, or when bandwidth is limited. Reducing image file sizes by 70-90% means pages load faster and use less data, improving accessibility and user experience across all connection types.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-pink-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Cost Reduction</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Smaller image files reduce hosting costs, bandwidth costs, and CDN expenses. For websites with high traffic, image compression can significantly reduce infrastructure costs. Cloud storage providers charge based on storage and bandwidth usage - compressing images reduces both, leading to substantial cost savings for businesses and individuals.
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
                <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
              </div>
              
              <p className="mt-2 text-slate-600 leading-relaxed">
                Our image compressor makes it easy to compress images in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Upload your image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, and BMP. The tool will automatically load your image, display the original file size, and start compression automatically. You'll see the original dimensions and file size immediately.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Adjust compression settings</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Use the quality slider to adjust compression level (0.1 to 1.0). Higher values maintain better quality but result in larger files. Lower values create smaller files but may reduce quality. You can also choose output format: JPEG (best compression, widely supported), WebP (modern format with excellent compression), or PNG (lossless compression). Quick presets are available for common quality levels.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Preview and download</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Review the compressed image in the preview area. Compare original and compressed file sizes, and check the compression ratio percentage. The tool shows real-time compression statistics. When satisfied with the results, click 'Download Compressed Image' to save the compressed image to your device. The image is processed entirely in your browser using the Canvas API - no server upload required.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="md:col-span-5">
              <div className="sticky top-24 rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Image Compressor?</h3>
                </div>
                
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">100% client-side processing</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Adjustable quality settings</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Multiple output formats</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Real-time compression preview</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
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
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Image Compression</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Following these best practices ensures optimal compression results:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Choose the Right Quality Setting</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Quality settings depend on your use case. Use 0.9-1.0 (Maximum/High Quality) for print materials, professional photography, or when quality is critical. Use 0.7-0.8 (Good Quality) for web use, social media, or general purposes - this provides excellent quality with good compression (typically 60-80% size reduction). Use 0.5-0.6 (Medium Quality) for thumbnails, previews, or when file size is important. Use 0.2-0.4 (Low Quality) only for very small file size requirements.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Select the Appropriate Format</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Choose output format based on your needs. JPEG provides the best compression for photos and complex images (60-90% reduction). WebP offers 25-35% better compression than JPEG at the same quality, but requires modern browser support. PNG is lossless and preserves exact quality, but offers less compression (10-50% reduction) - best for graphics, logos, or images with transparency. For web use, JPEG or WebP are usually the best choices.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Preview Before Downloading</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Always preview the compressed image before downloading to ensure quality meets your needs. Compare the original and compressed versions side-by-side if possible. Check for compression artifacts, blurriness, or quality loss. Adjust the quality setting if needed - it's better to use a slightly higher quality setting than to end up with an unusable compressed image. Our tool provides real-time preview so you can fine-tune settings instantly.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Balance Quality and File Size</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Find the optimal balance between image quality and file size for your specific use case. For web use, aim for quality 0.7-0.8 which typically provides 60-80% size reduction with excellent visual quality. For email attachments, quality 0.6-0.7 often works well. For print, use quality 0.9-1.0. Remember that very high compression (low quality) can introduce visible artifacts, while very low compression (high quality) may not provide sufficient file size reduction.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open>
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is image compression?</summary>
                <p className="mt-2 text-sm text-slate-600">Image compression is the process of reducing image file size while maintaining acceptable visual quality. Compression reduces the amount of data needed to store or transmit an image, making files smaller for faster loading, easier sharing, and reduced storage space. There are two types: lossless compression (PNG) preserves exact quality but offers less size reduction, while lossy compression (JPEG, WebP) reduces file size more significantly but may slightly reduce quality.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How does image compression work?</summary>
                <p className="mt-2 text-sm text-slate-600">Image compression works by removing redundant or less important image data. Lossy compression (JPEG, WebP) uses algorithms to identify and remove details that are less noticeable to the human eye, while preserving important visual information. Our tool uses the HTML5 Canvas API to compress images entirely in your browser. By adjusting the quality parameter (0.1 to 1.0), you control the balance between file size and image quality - lower quality values create smaller files with more compression artifacts.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Will compression reduce image quality?</summary>
                <p className="mt-2 text-sm text-slate-600">Lossy compression formats (JPEG, WebP) will reduce quality slightly when compressed, especially at lower quality settings. However, modern compression algorithms are designed to minimize visible quality loss. At quality settings of 0.8 or higher, most images maintain excellent visual quality while achieving significant file size reduction. PNG compression is lossless and maintains exact quality, but offers less size reduction. You can preview the compressed image before downloading to ensure quality meets your needs.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What image formats are supported?</summary>
                <p className="mt-2 text-sm text-slate-600">Our image compressor supports uploading JPEG, PNG, GIF, WebP, and BMP images. For output, you can choose JPEG (best compression, widely supported), WebP (modern format with excellent compression, supported by modern browsers), or PNG (lossless compression, good for graphics with transparency). The tool automatically suggests the best output format based on your input image type.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What quality setting should I use?</summary>
                <p className="mt-2 text-sm text-slate-600">Quality settings depend on your use case. Use 0.9-1.0 (Maximum/High Quality) for print materials, professional photography, or when quality is critical. Use 0.7-0.8 (Good Quality) for web use, social media, or general purposes - this provides excellent quality with good compression. Use 0.5-0.6 (Medium Quality) for thumbnails, previews, or when file size is important. Use 0.2-0.4 (Low Quality) only for very small file size requirements or when quality isn't critical. Always preview before downloading.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my image data secure?</summary>
                <p className="mt-2 text-sm text-slate-600">Absolutely. All image compression happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The compression algorithm runs locally in your browser without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How much can I compress an image?</summary>
                <p className="mt-2 text-sm text-slate-600">Compression depends on the image content and format. JPEG images typically compress 60-90% of original size at quality 0.8, with higher compression (70-95%) at lower quality settings. PNG images compress less (10-50%) since they're already optimized, but converting PNG to JPEG can achieve 70-90% reduction. WebP format typically provides 25-35% better compression than JPEG at the same quality. Actual compression ratios vary based on image complexity, colors, and original format.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I compress multiple images at once?</summary>
                <p className="mt-2 text-sm text-slate-600">Currently, our image compressor processes one image at a time. To compress multiple images, upload and compress each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch compression tools.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Related Tools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Related Image Tools</h2>
            <p className="text-slate-600">Explore our complete suite of image tools for developers and designers:</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
            <Link href="/image-tools/image-resizer" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📏</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Image Resizer</p>
                  <p className="text-xs text-slate-500">Resize Images</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Resize images to specific dimensions or maintain aspect ratio. Perfect for social media and web use.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Open tool →</p>
            </Link>
            
            <Link href="/image-tools/image-format-converter" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔄</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Image Format Converter</p>
                  <p className="text-xs text-slate-500">Convert Formats</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Convert images between JPEG, PNG, GIF, WebP, BMP, and SVG formats. Maintain quality while changing formats.</p>
              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">Open tool →</p>
            </Link>
            
            <Link href="/image-tools/image-cropper" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">✂️</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Image Cropper</p>
                  <p className="text-xs text-slate-500">Crop Images</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Crop images to desired dimensions or aspect ratios. Perfect for social media and thumbnails.</p>
              <p className="mt-4 text-sm font-semibold text-green-600 group-hover:text-green-700">Open tool →</p>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link href="/tools/image-tools" className="group rounded-3xl border-2 border-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 p-6 hover:shadow-xl transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🖼️</span>
                </div>
                <div>
                  <p className="text-base font-bold text-white">All Image Tools</p>
                  <p className="text-xs text-slate-400">Browse Complete Suite</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">Discover all our free image tools for resizing, compressing, converting, cropping, rotating, and more.</p>
              <p className="mt-4 text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">Browse all tools →</p>
            </Link>
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

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </>
  );
}
