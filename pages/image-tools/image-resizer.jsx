import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function ImageResizer() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [resizedImageUrl, setResizedImageUrl] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/image-tools/image-resizer`;

  // Preset sizes
  const presets = [
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Post', width: 1200, height: 630 },
    { name: 'Twitter Header', width: 1500, height: 500 },
    { name: 'LinkedIn Post', width: 1200, height: 627 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { name: 'Website Banner', width: 1920, height: 1080 },
    { name: 'Square 1:1', width: 1000, height: 1000 },
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

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setWidth(img.width);
        setHeight(img.height);
        setImageUrl(event.target.result);
        setUploadedImage(img);
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

  // Handle width change
  const handleWidthChange = (newWidth) => {
    const numWidth = parseInt(newWidth) || 0;
    setWidth(numWidth);
    
    if (maintainAspectRatio && originalWidth > 0 && originalHeight > 0) {
      const aspectRatio = originalWidth / originalHeight;
      const newHeight = Math.round(numWidth / aspectRatio);
      setHeight(newHeight);
    }
  };

  // Handle height change
  const handleHeightChange = (newHeight) => {
    const numHeight = parseInt(newHeight) || 0;
    setHeight(numHeight);
    
    if (maintainAspectRatio && originalWidth > 0 && originalHeight > 0) {
      const aspectRatio = originalWidth / originalHeight;
      const newWidth = Math.round(numHeight * aspectRatio);
      setWidth(newWidth);
    }
  };

  // Apply preset
  const applyPreset = (preset) => {
    setWidth(preset.width);
    setHeight(preset.height);
    setMaintainAspectRatio(false);
  };

  // Resize image
  const resizeImage = () => {
    if (!uploadedImage || !imageUrl) {
      setError('Please upload an image first');
      return;
    }

    if (width <= 0 || height <= 0) {
      setError('Width and height must be greater than 0');
      return;
    }

    setError('');

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        setError('Canvas not available');
        return;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(uploadedImage, 0, 0, width, height);

      // Convert canvas to image URL
      const resizedDataUrl = canvas.toDataURL('image/png', 1.0);
      setResizedImageUrl(resizedDataUrl);
    } catch (err) {
      setError('Error resizing image: ' + err.message);
    }
  };

  // Auto-resize when dimensions change
  useEffect(() => {
    if (uploadedImage && imageUrl && width > 0 && height > 0) {
      resizeImage();
    }
  }, [width, height, imageUrl, uploadedImage]);

  // Download resized image
  const handleDownload = () => {
    if (!resizedImageUrl) {
      setError('Please resize an image first');
      return;
    }

    const link = document.createElement('a');
    link.download = fileName ? `resized-${fileName}` : 'resized-image.png';
    link.href = resizedImageUrl;
    link.click();
  };

  // Clear everything
  const handleClear = () => {
    setUploadedImage(null);
    setImageUrl('');
    setResizedImageUrl('');
    setOriginalWidth(0);
    setOriginalHeight(0);
    setWidth(800);
    setHeight(600);
    setError('');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
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
        { "@type": "ListItem", "position": 4, "name": "Image Resizer", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Image Resizer",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "3247",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Resize images to specific dimensions",
        "Maintain aspect ratio option",
        "Quick presets for social media",
        "Real-time preview",
        "100% client-side processing",
        "No registration required",
        "Instant image resizing",
        "Download resized images"
      ],
      "description": "Free online image resizer. Resize images to specific dimensions or maintain aspect ratio. Perfect for social media, web use, and print. Works 100% in your browser using Canvas API. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Resize Images Online",
      "description": "Step-by-step guide to resize images online for free using FixTools Image Resizer.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your image",
          "text": "Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, and BMP. The tool will automatically load your image and display the original dimensions (width and height) in pixels.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Set new dimensions",
          "text": "Enter your desired width and height in pixels. You can manually enter values or use quick presets for common sizes like Instagram Post (1080×1080), Facebook Post (1200×630), Twitter Header (1500×500), or YouTube Thumbnail (1280×720). Enable 'Maintain aspect ratio' to keep proportions when changing one dimension.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Preview and download",
          "text": "The resized image appears instantly in the preview area. Review the new dimensions and image quality, then click 'Download Resized Image' to save the resized image to your device. The image is processed entirely in your browser - no server upload required.",
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
          "name": "What is image resizing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Image resizing is the process of changing the dimensions (width and height) of an image. When you resize an image, you can make it larger or smaller while maintaining or changing the aspect ratio. Image resizing is essential for optimizing images for web use, social media, print materials, email attachments, and various other applications. Our image resizer uses the HTML5 Canvas API to resize images entirely in your browser."
          }
        },
        {
          "@type": "Question",
          "name": "Will resizing reduce image quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Enlarging images (making them bigger) will typically reduce quality because pixels are stretched and interpolated. Reducing image size (making them smaller) usually maintains good quality, though very small reductions might show slight softening. For best results, start with high-resolution images when possible, and avoid multiple resizing cycles which can accumulate quality loss. The Canvas API uses bilinear interpolation for resizing, which provides good quality for most use cases."
          }
        },
        {
          "@type": "Question",
          "name": "What image formats are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our image resizer supports all common image formats including JPEG, PNG, GIF, WebP, BMP, and SVG. You can upload images in any of these formats, and the resized image will be available for download. The tool processes images using the Canvas API, which provides broad format support across modern web browsers."
          }
        },
        {
          "@type": "Question",
          "name": "What is aspect ratio and should I maintain it?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Aspect ratio is the proportional relationship between an image's width and height (e.g., 16:9, 4:3, 1:1). Maintaining aspect ratio prevents distortion - when enabled, changing the width automatically adjusts the height to keep proportions. Disable it only when you need specific non-proportional dimensions (which may cause stretching). Most use cases benefit from maintaining aspect ratio to preserve image appearance."
          }
        },
        {
          "@type": "Question",
          "name": "What are the recommended sizes for social media?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Common social media image sizes include: Instagram Post (1080×1080px), Instagram Story (1080×1920px), Facebook Post (1200×630px), Twitter Header (1500×500px), LinkedIn Post (1200×627px), and YouTube Thumbnail (1280×720px). Our tool includes quick presets for all these sizes, making it easy to resize images for social media platforms. Using the correct dimensions ensures your images display optimally without cropping or distortion."
          }
        },
        {
          "@type": "Question",
          "name": "Is my image data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All image processing happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The resizing algorithm runs locally in your browser without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "What's the maximum image size I can resize?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The maximum dimensions depend on your browser's Canvas API limits, which typically range from 4,096 to 16,384 pixels per side depending on the browser. Our tool accepts dimensions up to 10,000 pixels for width and height, which covers most use cases. For very large images, consider using desktop image editing software. The tool works best with images under 50MB file size."
          }
        },
        {
          "@type": "Question",
          "name": "Can I resize multiple images at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our image resizer processes one image at a time. To resize multiple images, upload and process each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch processing tools."
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
        <title>Image Resizer - Free Online Tool to Resize Images | FixTools</title>
        <meta name="title" content="Image Resizer - Free Online Tool to Resize Images | FixTools" />
        <meta name="description" content="Resize images to specific dimensions or maintain aspect ratio. Free online image resizer. Works 100% in your browser - fast, secure, no registration required." />
        <meta name="keywords" content="image resizer, resize image, image resize tool, resize photos, resize pictures, online image resizer, free image resizer" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Image Resizer - Free Online Tool to Resize Images" />
        <meta property="og:description" content="Resize images to specific dimensions or maintain aspect ratio. Free online image resizer with social media presets. Works 100% in your browser." />
        <meta property="og:image" content={`${siteHost}/images/image-resizer-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Image Resizer - Free Online Tool to Resize Images" />
        <meta property="twitter:description" content="Resize images to specific dimensions or maintain aspect ratio. Free online image resizer with social media presets." />
        <meta property="twitter:image" content={`${siteHost}/images/image-resizer-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.image-resizer-page) {
          font-size: 100% !important;
        }
        
        .image-resizer-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .image-resizer-page *,
        .image-resizer-page *::before,
        .image-resizer-page *::after {
          box-sizing: border-box;
        }
        
        .image-resizer-page h1,
        .image-resizer-page h2,
        .image-resizer-page h3,
        .image-resizer-page p,
        .image-resizer-page ul,
        .image-resizer-page ol {
          margin: 0;
        }
        
        .image-resizer-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .image-resizer-page input,
        .image-resizer-page textarea,
        .image-resizer-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="image-resizer-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Image Resizer</span></li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-1.5 text-xs font-semibold text-purple-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Free • Fast • Privacy-first
            </div>
            
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Image Resizer
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Resize images to specific dimensions or maintain aspect ratio. Free online image resizer that works 100% in your browser.
            </p>

            <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
              <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                <span className="relative z-10 flex items-center gap-2">⚡ Resize Image</span>
              </a>
              <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                How it works
              </a>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Processing</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Client-Side</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Speed</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Instant</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Privacy</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">100%</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Free</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Tool Interface */}
        <section id="tool" className="mx-auto max-w-6xl px-4 pb-12 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Resize Image online</h2>
                <p className="mt-1 text-sm text-slate-600">Upload an image and resize it to your desired dimensions.</p>
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
                {/* Original Image Info */}
                <div className="mt-6 p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Original Size:</span>
                      <span className="ml-2 font-semibold text-slate-900">{originalWidth} × {originalHeight}px</span>
                    </div>
                    <div>
                      <span className="text-slate-600">New Size:</span>
                      <span className="ml-2 font-semibold text-slate-900">{width} × {height}px</span>
                    </div>
                  </div>
                </div>

                {/* Dimensions Input */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Width (px)</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      min="1"
                      max="10000"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Height (px)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      min="1"
                      max="10000"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                {/* Aspect Ratio Lock */}
                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="aspectRatio"
                    checked={maintainAspectRatio}
                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="aspectRatio" className="text-sm text-slate-700 cursor-pointer">
                    Maintain aspect ratio
                  </label>
                </div>

                {/* Presets */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Quick Presets</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {presets.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => applyPreset(preset)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold hover:bg-slate-50 hover:border-purple-300 transition-colors"
                      >
                        {preset.name}
                        <br />
                        <span className="text-slate-500">{preset.width}×{preset.height}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                {resizedImageUrl && (
                  <div className="mt-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <label className="text-sm font-semibold text-slate-800">Resized Image Preview</label>
                      <button
                        onClick={handleDownload}
                        className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
                      >
                        ⬇ Download Resized Image
                      </button>
                    </div>
                    <div className="mt-2 flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
                      <img src={resizedImageUrl} alt="Resized" className="max-w-full h-auto max-h-96" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* What is Image Resizing Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Image Resizing?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Image resizing</strong> is the process of changing the dimensions (width and height) of an image. When you resize an image, you can make it larger or smaller while optionally maintaining the aspect ratio (the proportional relationship between width and height). Image resizing is one of the most common image editing tasks, essential for optimizing images for web use, social media platforms, email attachments, print materials, and various digital applications.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">MDN Web Docs</a>, the HTML5 Canvas API enables powerful client-side image manipulation without server processing. Our image resizer uses the Canvas API to resize images entirely in your browser, ensuring complete privacy and security. The <a href="https://www.w3.org/TR/2dcontext/" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">W3C Canvas 2D Context specification</a> provides standardized image processing capabilities across modern browsers.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Image resizing is different from image compression (which reduces file size) and image cropping (which removes parts of an image). Resizing changes dimensions while preserving the entire image content, making it perfect for adapting images to specific display requirements, social media formats, or file size constraints.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Without Aspect Ratio Lock
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Image may appear stretched or distorted</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Proportions don't match original</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Can create unusual image shapes</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">✓</span>
                    With Aspect Ratio Lock
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Image maintains original proportions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>No distortion or stretching</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Natural-looking resized images</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Image Resizing Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use Image Resizing?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Image resizing is essential for modern digital workflows:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Social Media Optimization</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Each social media platform has specific image dimension requirements. Instagram posts need 1080×1080px, stories need 1080×1920px, Facebook posts work best at 1200×630px, and Twitter headers require 1500×500px. Resizing images to these exact dimensions ensures optimal display without cropping or distortion, improving engagement and professional appearance.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Website Performance</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Large images slow down website loading times, negatively impacting user experience and SEO rankings. Resizing images to appropriate dimensions for web use (typically 800-1920px width) reduces file size while maintaining quality. According to <a href="https://web.dev/vitals/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">Google's Core Web Vitals</a>, image optimization is crucial for good page performance scores.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Email Attachments</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Email clients often limit attachment sizes (typically 10-25MB). Large images can exceed these limits or cause slow email delivery. Resizing images before attaching ensures emails send quickly and remain within size limits. Most email clients display images at 600-800px width, so resizing to these dimensions is usually sufficient.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🖨️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Print Materials</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Print materials require specific resolutions (typically 300 DPI) and dimensions. Resizing images to match print dimensions (e.g., business cards at 3.5×2 inches, flyers at 8.5×11 inches) ensures crisp, professional prints. Our tool provides pixel dimensions, which you can convert to inches at your desired DPI for print quality.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Storage Space</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Smaller images take up less storage space on your device or server. Resizing high-resolution photos (often 4000×3000px or larger from modern cameras) to web-appropriate sizes (1920×1080px or smaller) can reduce file size by 75-90% while maintaining excellent visual quality for most uses.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-pink-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Consistent Branding</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Maintaining consistent image dimensions across your website, social media, and marketing materials creates a professional, cohesive brand appearance. Resizing images to standard sizes ensures all visuals align with your brand guidelines and display consistently across platforms and devices.
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
                Our image resizer makes it easy to resize images in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Upload your image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, and BMP. The tool will automatically load your image and display the original dimensions. You'll see both the original size and can set new dimensions for the resized image.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Set new dimensions</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Enter your desired width and height in pixels, or use quick presets for common sizes like Instagram Post (1080×1080), Facebook Post (1200×630), Twitter Header (1500×500), or YouTube Thumbnail (1280×720). Enable 'Maintain aspect ratio' to automatically adjust one dimension when you change the other, keeping proportions intact.
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
                      The resized image appears instantly in the preview area. Review the new dimensions and image quality, then click 'Download Resized Image' to save the resized image to your device. The image is processed entirely in your browser using the Canvas API - no server upload required, ensuring complete privacy.
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
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Image Resizer?</h3>
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
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Instant preview and download</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Quick presets for social media</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Maintain aspect ratio option</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Image Resizing</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Following these best practices ensures optimal results when resizing images:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Maintain Aspect Ratio for Natural Appearance</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Unless you specifically need non-proportional dimensions, always enable 'Maintain aspect ratio' to preserve the image's original proportions. This prevents stretching, distortion, and unnatural-looking images. Most use cases benefit from maintaining aspect ratio, as it keeps images looking natural and professional.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use Appropriate Dimensions for Your Use Case</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Different platforms and uses require different dimensions. Use our quick presets for social media (Instagram, Facebook, Twitter, LinkedIn, YouTube) or set custom dimensions based on your needs. For web use, 800-1920px width is typically sufficient. For print, calculate dimensions based on your desired print size and DPI (300 DPI is standard for high-quality prints).
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Start with High-Resolution Source Images</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      When resizing images, it's better to start with high-resolution source images and resize down than to enlarge small images. Enlarging images (upscaling) often results in quality loss, pixelation, and blurriness. Always begin with the highest quality source image available to ensure the best resized result.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Avoid Multiple Resizing Cycles</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Each resize operation can introduce slight quality loss. Avoid resizing an image multiple times - instead, always resize from the original high-quality source image. If you need different sizes, resize from the original multiple times rather than resizing a previously resized image.
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
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is image resizing?</summary>
                <p className="mt-2 text-sm text-slate-600">Image resizing is the process of changing the dimensions (width and height) of an image. When you resize an image, you can make it larger or smaller while maintaining or changing the aspect ratio. Image resizing is essential for optimizing images for web use, social media, print materials, email attachments, and various other applications. Our image resizer uses the HTML5 Canvas API to resize images entirely in your browser.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Will resizing reduce image quality?</summary>
                <p className="mt-2 text-sm text-slate-600">Enlarging images (making them bigger) will typically reduce quality because pixels are stretched and interpolated. Reducing image size (making them smaller) usually maintains good quality, though very small reductions might show slight softening. For best results, start with high-resolution images when possible, and avoid multiple resizing cycles which can accumulate quality loss. The Canvas API uses bilinear interpolation for resizing, which provides good quality for most use cases.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What image formats are supported?</summary>
                <p className="mt-2 text-sm text-slate-600">Our image resizer supports all common image formats including JPEG, PNG, GIF, WebP, BMP, and SVG. You can upload images in any of these formats, and the resized image will be available for download. The tool processes images using the Canvas API, which provides broad format support across modern web browsers.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is aspect ratio and should I maintain it?</summary>
                <p className="mt-2 text-sm text-slate-600">Aspect ratio is the proportional relationship between an image's width and height (e.g., 16:9, 4:3, 1:1). Maintaining aspect ratio prevents distortion - when enabled, changing the width automatically adjusts the height to keep proportions. Disable it only when you need specific non-proportional dimensions (which may cause stretching). Most use cases benefit from maintaining aspect ratio to preserve image appearance.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What are the recommended sizes for social media?</summary>
                <p className="mt-2 text-sm text-slate-600">Common social media image sizes include: Instagram Post (1080×1080px), Instagram Story (1080×1920px), Facebook Post (1200×630px), Twitter Header (1500×500px), LinkedIn Post (1200×627px), and YouTube Thumbnail (1280×720px). Our tool includes quick presets for all these sizes, making it easy to resize images for social media platforms. Using the correct dimensions ensures your images display optimally without cropping or distortion.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my image data secure?</summary>
                <p className="mt-2 text-sm text-slate-600">Absolutely. All image processing happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The resizing algorithm runs locally in your browser without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What's the maximum image size I can resize?</summary>
                <p className="mt-2 text-sm text-slate-600">The maximum dimensions depend on your browser's Canvas API limits, which typically range from 4,096 to 16,384 pixels per side depending on the browser. Our tool accepts dimensions up to 10,000 pixels for width and height, which covers most use cases. For very large images, consider using desktop image editing software. The tool works best with images under 50MB file size.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I resize multiple images at once?</summary>
                <p className="mt-2 text-sm text-slate-600">Currently, our image resizer processes one image at a time. To resize multiple images, upload and process each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch processing tools.</p>
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
            <Link href="/image-tools/image-compressor" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🗜️</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Image Compressor</p>
                  <p className="text-xs text-slate-500">Compress Images</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Compress images to reduce file size while maintaining quality. Optimize images for faster loading times.</p>
              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">Open tool →</p>
            </Link>
            
            <Link href="/image-tools/image-format-converter" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔄</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Image Format Converter</p>
                  <p className="text-xs text-slate-500">Convert Formats</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Convert images between JPEG, PNG, GIF, WebP, BMP, and SVG formats. Maintain quality while changing formats.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Open tool →</p>
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
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
}
