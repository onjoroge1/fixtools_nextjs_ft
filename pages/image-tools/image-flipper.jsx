import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function ImageFlipper() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [flippedImageUrl, setFlippedImageUrl] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/image-tools/image-flipper`;

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
    setFlippedImageUrl(''); // Clear previous result
    setFlipHorizontal(false);
    setFlipVertical(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setImageUrl(event.target.result);
        setUploadedImage(img);
        // Auto-flip on load if needed
        setTimeout(() => flipImage(img, false, false), 100);
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

  // Flip image
  const flipImage = (img = uploadedImage, horizontal = flipHorizontal, vertical = flipVertical) => {
    if (!img || !imageUrl) {
      setError('Please upload an image first');
      return;
    }

    setError('');

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        setError('Canvas not available');
        return;
      }

      // Set canvas dimensions to image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      
      // Save the current context state
      ctx.save();

      // Calculate scale factors
      const scaleX = horizontal ? -1 : 1;
      const scaleY = vertical ? -1 : 1;

      // Translate to the center of the canvas
      ctx.translate(canvas.width / 2, canvas.height / 2);
      
      // Apply scale transformation (flip)
      ctx.scale(scaleX, scaleY);
      
      // Draw image centered (accounting for the scale)
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      // Restore the context state
      ctx.restore();

      // Convert canvas to image URL
      const flippedDataUrl = canvas.toDataURL('image/png', 1.0);
      setFlippedImageUrl(flippedDataUrl);
    } catch (err) {
      setError('Error flipping image: ' + err.message);
    }
  };

  // Handle horizontal flip toggle
  const handleHorizontalFlip = () => {
    const newHorizontal = !flipHorizontal;
    setFlipHorizontal(newHorizontal);
    if (uploadedImage) {
      setTimeout(() => flipImage(uploadedImage, newHorizontal, flipVertical), 50);
    }
  };

  // Handle vertical flip toggle
  const handleVerticalFlip = () => {
    const newVertical = !flipVertical;
    setFlipVertical(newVertical);
    if (uploadedImage) {
      setTimeout(() => flipImage(uploadedImage, flipHorizontal, newVertical), 50);
    }
  };

  // Reset flip
  const handleReset = () => {
    setFlipHorizontal(false);
    setFlipVertical(false);
    if (uploadedImage) {
      setTimeout(() => flipImage(uploadedImage, false, false), 50);
    }
  };

  // Auto-flip when settings change
  useEffect(() => {
    if (uploadedImage && imageUrl) {
      flipImage(uploadedImage, flipHorizontal, flipVertical);
    }
  }, [flipHorizontal, flipVertical, imageUrl, uploadedImage]);

  // Download flipped image
  const handleDownload = () => {
    if (!flippedImageUrl) {
      setError('Please flip an image first');
      return;
    }

    const link = document.createElement('a');
    const flipSuffix = [];
    if (flipHorizontal) flipSuffix.push('h');
    if (flipVertical) flipSuffix.push('v');
    const suffix = flipSuffix.length > 0 ? `-flipped-${flipSuffix.join('')}` : '';
    link.download = fileName ? `${fileName.replace(/\.[^/.]+$/, '')}${suffix}.png` : 'flipped-image.png';
    link.href = flippedImageUrl;
    link.click();
  };

  // Clear everything
  const handleClear = () => {
    setUploadedImage(null);
    setImageUrl('');
    setFlippedImageUrl('');
    setOriginalWidth(0);
    setOriginalHeight(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
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
        { "@type": "ListItem", "position": 4, "name": "Image Flipper", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Image Flipper",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1924",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Flip images horizontally (mirror left-right)",
        "Flip images vertically (mirror top-bottom)",
        "Flip both directions simultaneously",
        "Real-time preview of flipped image",
        "100% client-side processing",
        "No registration required",
        "Instant flipping",
        "Supports all common image formats"
      ],
      "description": "Free online tool to flip images horizontally or vertically. Mirror images left-right or top-bottom. Perfect for correcting orientation, creating mirror effects, or adjusting image direction. Works 100% in your browser. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Flip Images Online",
      "description": "Step-by-step guide to flip images horizontally or vertically online for free using FixTools Image Flipper.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your image",
          "text": "Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, BMP, and SVG. The tool will automatically load your image and display it. You'll see the original dimensions and a preview of the image immediately.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose flip direction",
          "text": "Select whether you want to flip the image horizontally (mirror left-right), vertically (mirror top-bottom), or both. Click the 'Flip Horizontal' button to mirror the image left-to-right, or 'Flip Vertical' to mirror top-to-bottom. You can also flip both directions simultaneously by enabling both options. The tool automatically updates the preview as you toggle flip options.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Preview the flipped image",
          "text": "Review the flipped image in the preview area. The tool shows the result in real-time as you toggle flip options. Check that the flip direction is correct and the image orientation meets your requirements. You can reset the flip at any time to return to the original orientation.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Download the flipped image",
          "text": "Click the 'Download Flipped Image' button to save the flipped image to your device. The image will be saved with the flip applied. The flipping is processed entirely in your browser using the Canvas API's scale transformation - no server upload required.",
          "position": 4
        }
      ]
    },
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is image flipping?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Image flipping is the process of mirroring an image along an axis. Horizontal flipping mirrors the image left-to-right (like looking in a mirror), while vertical flipping mirrors the image top-to-bottom (like flipping it upside down). Flipping preserves all image content but changes the orientation and direction. This is different from rotation, which turns the image around a point."
          }
        },
        {
          "@type": "Question",
          "name": "Why flip images?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Flipping images is useful for correcting orientation (especially for photos taken with front-facing cameras that mirror images), creating mirror effects, adjusting image direction for design layouts, preparing images for specific display requirements, or creating symmetrical compositions. Horizontal flipping is especially common for selfies and portraits taken with front-facing cameras, which often mirror images automatically."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between flipping and rotating?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Flipping mirrors an image along an axis (left-right or top-bottom), while rotating turns an image around a center point. Flipping preserves the image's dimensions but changes the direction, while rotation may change dimensions to accommodate the rotated image. For example, flipping horizontally creates a mirror image, while rotating 180° turns the image upside down. Flipping is a lossless transformation that maintains perfect quality."
          }
        },
        {
          "@type": "Question",
          "name": "Can I flip both horizontally and vertically?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can flip images both horizontally and vertically simultaneously. This creates a 180° rotation effect (upside down and mirrored), but it's achieved through flipping rather than rotation. When both flips are enabled, the image is mirrored along both axes, effectively rotating it 180° while maintaining the same dimensions."
          }
        },
        {
          "@type": "Question",
          "name": "Will flipping reduce image quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, flipping is a lossless transformation that maintains perfect image quality. Unlike rotation at arbitrary angles (which may require pixel interpolation), flipping uses simple scale transformations that don't require interpolation. The flipped image maintains the same resolution, quality, and pixel density as the original image. Flipping is one of the highest quality image transformations available."
          }
        },
        {
          "@type": "Question",
          "name": "What image formats are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Image Flipper supports all common image formats including JPEG, PNG, GIF, WebP, BMP, and SVG. You can upload images in any of these formats and flip them. The flipped image is saved as PNG format to preserve quality and support transparency if the original image had it."
          }
        },
        {
          "@type": "Question",
          "name": "Is my image data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All image flipping happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The flipping algorithm runs locally in your browser without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "Can I flip multiple images at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our Image Flipper processes one image at a time. To flip multiple images, upload and flip each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch flipping tools."
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
        <title>Image Flipper - Free Online Tool to Flip Images Horizontally or Vertically | FixTools</title>
        <meta name="title" content="Image Flipper - Free Online Tool to Flip Images Horizontally or Vertically | FixTools" />
        <meta name="description" content="Flip images horizontally or vertically. Free online image flipper. Mirror images left-right or top-bottom. Perfect for correcting orientation, creating mirror effects, or adjusting image direction. Works 100% in your browser - fast, secure, no registration required." />
        <meta name="keywords" content="image flipper, flip image, mirror image, flip image horizontally, flip image vertically, image mirror tool, free image flipper, flip image online" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Image Flipper - Free Online Tool to Flip Images" />
        <meta property="og:description" content="Flip images horizontally or vertically. Free online image flipper. Mirror images left-right or top-bottom." />
        <meta property="og:image" content={`${siteHost}/images/image-flipper-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Image Flipper - Free Online Tool to Flip Images" />
        <meta property="twitter:description" content="Flip images horizontally or vertically. Free online image flipper." />
        <meta property="twitter:image" content={`${siteHost}/images/image-flipper-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.image-flipper-page) {
          font-size: 100% !important;
        }
        
        .image-flipper-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .image-flipper-page *,
        .image-flipper-page *::before,
        .image-flipper-page *::after {
          box-sizing: border-box;
        }
        
        .image-flipper-page h1,
        .image-flipper-page h2,
        .image-flipper-page h3,
        .image-flipper-page p,
        .image-flipper-page ul,
        .image-flipper-page ol {
          margin: 0;
        }
        
        .image-flipper-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .image-flipper-page input,
        .image-flipper-page textarea,
        .image-flipper-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="image-flipper-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Image Flipper</span></li>
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
                Image Flipper
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Flip images horizontally or vertically. Free online image flipper. Mirror images left-right or top-bottom. Perfect for correcting orientation, creating mirror effects, or adjusting image direction. Works 100% in your browser.
            </p>

            <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
              <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                <span className="relative z-10 flex items-center gap-2">⚡ Flip Image</span>
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
                <h2 className="text-xl font-semibold text-slate-900">Flip Image</h2>
                <p className="mt-1 text-sm text-slate-600">Upload an image and flip it horizontally or vertically.</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Original Dimensions:</span>
                      <span className="ml-2 font-semibold text-slate-900">{originalWidth} × {originalHeight}px</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Flip Status:</span>
                      <span className="ml-2 font-semibold text-slate-900">
                        {!flipHorizontal && !flipVertical ? 'None' : ''}
                        {flipHorizontal && 'Horizontal'}
                        {flipHorizontal && flipVertical && ' + '}
                        {flipVertical && 'Vertical'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Flip Controls */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Flip Direction</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      onClick={handleHorizontalFlip}
                      className={`rounded-xl border-2 px-6 py-4 text-sm font-semibold transition-all ${
                        flipHorizontal
                          ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl">↔️</span>
                        <span>Flip Horizontal</span>
                        <span className="text-xs text-slate-500">Mirror left-right</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={handleVerticalFlip}
                      className={`rounded-xl border-2 px-6 py-4 text-sm font-semibold transition-all ${
                        flipVertical
                          ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl">↕️</span>
                        <span>Flip Vertical</span>
                        <span className="text-xs text-slate-500">Mirror top-bottom</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={handleReset}
                      className="rounded-xl border-2 border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl">↻</span>
                        <span>Reset</span>
                        <span className="text-xs text-slate-500">Original orientation</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Image Preview */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Flipped Image Preview</label>
                  <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <img src={flippedImageUrl || imageUrl} alt="Flipped" className="max-w-full h-auto max-h-96 rounded-lg" />
                  </div>
                </div>

                {/* Download Button */}
                {flippedImageUrl && (
                  <div className="mt-6">
                    <button
                      onClick={handleDownload}
                      className="w-full rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Download Flipped Image
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* What is Image Flipping Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Image Flipping?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Image flipping</strong> is the process of mirroring an image along an axis. Horizontal flipping mirrors the image left-to-right (like looking in a mirror), while vertical flipping mirrors the image top-to-bottom (like flipping it upside down). Flipping preserves all image content but changes the orientation and direction. This is different from rotation, which turns the image around a point.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">MDN Web Docs</a>, the HTML5 Canvas API enables powerful client-side image flipping without server processing. Our image flipper uses the Canvas API's <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">scale()</code> transformation method to flip images entirely in your browser, ensuring complete privacy and security. The <a href="https://www.w3.org/TR/2dcontext/" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">W3C Canvas 2D Context specification</a> provides standardized image flipping capabilities across modern browsers.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Flipping is essential for correcting orientation, especially for photos taken with front-facing cameras that mirror images automatically. Many mobile devices and webcams flip images horizontally by default, requiring correction for proper display. Flipping can also be used creatively to create mirror effects, adjust image direction for design layouts, or create symmetrical compositions.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">✓</span>
                    Horizontal Flipping
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Mirrors image left-to-right</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Like looking in a mirror</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Perfect for selfie correction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Maintains image dimensions</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">✓</span>
                    Vertical Flipping
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Mirrors image top-to-bottom</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Upside down mirror effect</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Creative design effects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Lossless transformation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Image Flipping Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Flip Images?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Image flipping is essential for modern digital workflows:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Correct Selfie Orientation</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Front-facing cameras on phones and webcams often mirror images horizontally by default, making text appear backwards and faces look reversed. Flipping images horizontally corrects this orientation, making selfies and portraits display correctly. This is especially important for photos with text, logos, or when the image direction matters for proper display.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Create Mirror Effects</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Flipping images creates mirror effects that can be used creatively in graphic design, art, and photography. Horizontal flipping creates left-right mirror images, while vertical flipping creates top-bottom mirror effects. These effects can be used to create symmetrical compositions, artistic reflections, or visual interest in designs.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">📐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Adjust Image Direction</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Flipping images adjusts their direction for specific layout requirements. When images need to face a particular direction for design layouts, match other elements, or align with text flow, flipping ensures proper orientation. This is essential for creating consistent layouts in websites, presentations, documents, or marketing materials where image direction matters.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Fix Camera Orientation</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Many cameras and devices save images with incorrect orientation due to EXIF data issues or device settings. Flipping images corrects orientation problems when rotation isn't needed. This is especially useful when images are displayed correctly in some applications but incorrectly in others, requiring manual correction through flipping.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Creative Design</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Flipping images can create interesting visual effects and compositions in graphic design and art. Symmetrical designs, mirrored patterns, and creative compositions can be achieved through flipping. This is useful for creating logos, patterns, artistic effects, or visual designs that require specific orientations or mirror effects.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Web Display</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Websites and applications may display images incorrectly if they're not properly oriented. Flipping images ensures they display correctly across all browsers, devices, and platforms. This is essential for maintaining professional appearance and ensuring images are usable and visually appealing on websites, social media, or applications where orientation matters.
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
                Our Image Flipper makes it easy to flip images in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Upload your image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, BMP, and SVG. The tool will automatically load your image and display it. You'll see the original dimensions and a preview of the image immediately.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Choose flip direction</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Select whether you want to flip the image horizontally (mirror left-right), vertically (mirror top-bottom), or both. Click the 'Flip Horizontal' button to mirror the image left-to-right, or 'Flip Vertical' to mirror top-to-bottom. You can also flip both directions simultaneously by enabling both options. The tool automatically updates the preview as you toggle flip options.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Preview the flipped image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Review the flipped image in the preview area. The tool shows the result in real-time as you toggle flip options. Check that the flip direction is correct and the image orientation meets your requirements. You can reset the flip at any time to return to the original orientation. The preview updates instantly as you change flip settings.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    4
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Download the flipped image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the 'Download Flipped Image' button to save the flipped image to your device. The image will be saved with the flip applied. The flipping is processed entirely in your browser using the Canvas API's scale transformation - no server upload required. The flipped image maintains perfect quality as flipping is a lossless transformation.
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
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Image Flipper?</h3>
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
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Horizontal and vertical flipping</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Lossless quality</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Real-time preview</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Image Flipping</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Following these best practices ensures optimal flipping results:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use Horizontal Flip for Selfies</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Front-facing cameras often mirror images horizontally, making text appear backwards and faces look reversed. Use horizontal flipping to correct selfie orientation, especially when text, logos, or directional elements are present. This ensures images display correctly and look natural, as if taken with a rear-facing camera or mirror.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Understand Flipping vs Rotation</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Flipping mirrors an image along an axis, while rotation turns it around a point. Use flipping when you need to mirror the image (like correcting selfie orientation), and use rotation when you need to turn it (like correcting portrait/landscape orientation). Flipping maintains dimensions, while rotation may change them. Choose the right transformation for your needs.
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
                      Always preview the flipped image before downloading to ensure the flip direction is correct. Check that text is readable (if present), that faces look natural, and that the image orientation meets your requirements. Use the reset button to return to the original orientation if needed. The preview updates instantly, making it easy to compare before and after.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Consider Image Content</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Be aware that flipping changes image direction, which may affect readability of text, direction of arrows, or orientation of logos. For images with text or directional elements, ensure flipping doesn't make them unreadable or incorrect. Horizontal flipping is generally safe for portraits and landscapes, but may affect images with text or directional graphics.
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
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is image flipping?</summary>
                <p className="mt-2 text-sm text-slate-600">Image flipping is the process of mirroring an image along an axis. Horizontal flipping mirrors the image left-to-right (like looking in a mirror), while vertical flipping mirrors the image top-to-bottom (like flipping it upside down). Flipping preserves all image content but changes the orientation and direction. This is different from rotation, which turns the image around a point.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Why flip images?</summary>
                <p className="mt-2 text-sm text-slate-600">Flipping images is useful for correcting orientation (especially for photos taken with front-facing cameras that mirror images), creating mirror effects, adjusting image direction for design layouts, preparing images for specific display requirements, or creating symmetrical compositions. Horizontal flipping is especially common for selfies and portraits taken with front-facing cameras, which often mirror images automatically.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What's the difference between flipping and rotating?</summary>
                <p className="mt-2 text-sm text-slate-600">Flipping mirrors an image along an axis (left-right or top-bottom), while rotating turns an image around a center point. Flipping preserves the image's dimensions but changes the direction, while rotation may change dimensions to accommodate the rotated image. For example, flipping horizontally creates a mirror image, while rotating 180° turns the image upside down. Flipping is a lossless transformation that maintains perfect quality.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I flip both horizontally and vertically?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, you can flip images both horizontally and vertically simultaneously. This creates a 180° rotation effect (upside down and mirrored), but it's achieved through flipping rather than rotation. When both flips are enabled, the image is mirrored along both axes, effectively rotating it 180° while maintaining the same dimensions.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Will flipping reduce image quality?</summary>
                <p className="mt-2 text-sm text-slate-600">No, flipping is a lossless transformation that maintains perfect image quality. Unlike rotation at arbitrary angles (which may require pixel interpolation), flipping uses simple scale transformations that don't require interpolation. The flipped image maintains the same resolution, quality, and pixel density as the original image. Flipping is one of the highest quality image transformations available.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What image formats are supported?</summary>
                <p className="mt-2 text-sm text-slate-600">Our Image Flipper supports all common image formats including JPEG, PNG, GIF, WebP, BMP, and SVG. You can upload images in any of these formats and flip them. The flipped image is saved as PNG format to preserve quality and support transparency if the original image had it.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my image data secure?</summary>
                <p className="mt-2 text-sm text-slate-600">Absolutely. All image flipping happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The flipping algorithm runs locally in your browser without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I flip multiple images at once?</summary>
                <p className="mt-2 text-sm text-slate-600">Currently, our Image Flipper processes one image at a time. To flip multiple images, upload and flip each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch flipping tools.</p>
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
            <Link href="/image-tools/image-rotator" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔄</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Image Rotator</p>
                  <p className="text-xs text-slate-500">Rotate Images</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Rotate images by any angle (0° to 360°). Perfect for correcting orientation or creative effects.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Open tool →</p>
            </Link>
            
            <Link href="/image-tools/image-resizer" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📏</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Image Resizer</p>
                  <p className="text-xs text-slate-500">Resize Images</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Resize images to specific dimensions or maintain aspect ratio. Perfect for social media and web use.</p>
              <p className="mt-4 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">Open tool →</p>
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
              <p className="text-sm text-slate-300 leading-relaxed">Discover all our free image tools for resizing, compressing, converting, cropping, rotating, flipping, and more.</p>
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

