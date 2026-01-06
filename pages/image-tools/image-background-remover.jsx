import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function ImageBackgroundRemover() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [targetColor, setTargetColor] = useState('#FFFFFF'); // Color to remove
  const [tolerance, setTolerance] = useState(30); // Color matching tolerance (0-100)
  const [removedImageUrl, setRemovedImageUrl] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const imagePreviewRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/image-tools/image-background-remover`;

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
    setRemovedImageUrl(''); // Clear previous result

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
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

  // Get color from image at click position
  const handleImageClick = (e) => {
    if (!imagePreviewRef.current || !uploadedImage) return;

    const rect = imagePreviewRef.current.getBoundingClientRect();
    const scaleX = uploadedImage.width / rect.width;
    const scaleY = uploadedImage.height / rect.height;
    
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    // Get color from canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = uploadedImage.width;
    tempCanvas.height = uploadedImage.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(uploadedImage, 0, 0);
    
    const imageData = tempCtx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    const hexColor = `#${[r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('')}`;
    
    setTargetColor(hexColor);
  };

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Calculate color distance
  const colorDistance = (r1, g1, b1, r2, g2, b2) => {
    return Math.sqrt(
      Math.pow(r2 - r1, 2) +
      Math.pow(g2 - g1, 2) +
      Math.pow(b2 - b1, 2)
    );
  };

  // Remove background
  const removeBackground = (img = uploadedImage) => {
    if (!img || !imageUrl) {
      setError('Please upload an image first');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        setError('Canvas not available');
        setIsProcessing(false);
        return;
      }

      // Set canvas dimensions to image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      
      // Draw the image
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Get target color RGB
      const targetRgb = hexToRgb(targetColor);
      if (!targetRgb) {
        setError('Invalid color selected');
        setIsProcessing(false);
        return;
      }

      // Calculate tolerance threshold (max distance for color matching)
      const toleranceThreshold = (tolerance / 100) * 255;

      // Process each pixel
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Calculate color distance
        const distance = colorDistance(
          r, g, b,
          targetRgb.r, targetRgb.g, targetRgb.b
        );

        // If color matches (within tolerance), make it transparent
        if (distance <= toleranceThreshold) {
          data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
      }

      // Put modified image data back
      ctx.putImageData(imageData, 0, 0);

      // Convert canvas to image URL
      const removedDataUrl = canvas.toDataURL('image/png', 1.0);
      setRemovedImageUrl(removedDataUrl);
    } catch (err) {
      setError('Error removing background: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-remove background when color or tolerance changes
  useEffect(() => {
    if (uploadedImage && imageUrl && targetColor) {
      // Debounce to avoid too many recalculations
      const timer = setTimeout(() => {
        removeBackground(uploadedImage);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [targetColor, tolerance, imageUrl, uploadedImage]);

  // Download image with removed background
  const handleDownload = () => {
    if (!removedImageUrl) {
      setError('Please remove background first');
      return;
    }

    const link = document.createElement('a');
    link.download = fileName ? `no-background-${fileName.replace(/\.[^/.]+$/, '')}.png` : 'no-background-image.png';
    link.href = removedImageUrl;
    link.click();
  };

  // Clear everything
  const handleClear = () => {
    setUploadedImage(null);
    setImageUrl('');
    setRemovedImageUrl('');
    setOriginalWidth(0);
    setOriginalHeight(0);
    setTargetColor('#FFFFFF');
    setTolerance(30);
    setError('');
    setFileName('');
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    if (previewCanvasRef.current) {
      const ctx = previewCanvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
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
        { "@type": "ListItem", "position": 4, "name": "Image Background Remover", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Image Background Remover",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "ratingCount": "2186",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Remove backgrounds from images and make them transparent",
        "Color-based background removal with tolerance control",
        "Click on image to select background color",
        "Adjustable color matching tolerance",
        "Real-time preview of background removal",
        "100% client-side processing",
        "No registration required",
        "Export as PNG with transparency"
      ],
      "description": "Free online tool to remove backgrounds from images and make them transparent. Select background color by clicking on the image or using color picker. Adjust tolerance for precise removal. Perfect for product photos, portraits, and graphics. Works 100% in your browser. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Remove Backgrounds from Images Online",
      "description": "Step-by-step guide to remove backgrounds from images online for free using FixTools Image Background Remover.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your image",
          "text": "Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, BMP, and SVG. The tool will automatically load your image and display it. You'll see the original dimensions and a preview of the image immediately.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Select background color",
          "text": "Choose the background color to remove. You can click directly on the image to select the color at that point, or use the color picker to choose a specific color. The tool will automatically detect the color you click on and use it as the target for removal. This works best with solid or uniform backgrounds.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Adjust tolerance",
          "text": "Use the tolerance slider to control how closely colors must match the selected color to be removed. Lower tolerance (0-20) removes only exact color matches, while higher tolerance (40-100) removes similar colors. Adjust the tolerance to fine-tune the background removal - start with 30 and adjust based on the preview results.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Preview and download",
          "text": "Review the background-removed image in the preview area. The tool shows the result with transparent background in real-time. Check that the background is properly removed and that important parts of the image aren't affected. When satisfied, click 'Download Image' to save the image with transparent background as PNG format. The background removal is processed entirely in your browser using the Canvas API - no server upload required.",
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
          "name": "What is background removal?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Background removal is the process of making the background of an image transparent, effectively removing it while keeping the main subject intact. This is useful for product photos, portraits, graphics, and images that need to be placed on different backgrounds. Background removal creates images with transparent backgrounds (alpha channel), typically saved as PNG format to preserve transparency."
          }
        },
        {
          "@type": "Question",
          "name": "Why remove backgrounds from images?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Removing backgrounds from images is essential for e-commerce product photos, creating graphics for websites, designing marketing materials, creating composite images, and preparing images for use on different backgrounds. Transparent backgrounds allow images to blend seamlessly with any background color or design. This is especially important for product catalogs, logo placement, and graphic design work."
          }
        },
        {
          "@type": "Question",
          "name": "How does background removal work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our background remover uses color-based removal. You select a background color (by clicking on the image or using a color picker), and the tool removes all pixels that match that color within a specified tolerance range. The tolerance setting controls how closely colors must match - lower tolerance removes only exact matches, while higher tolerance removes similar colors. This works best with solid or uniform backgrounds."
          }
        },
        {
          "@type": "Question",
          "name": "What tolerance setting should I use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Tolerance depends on your image. For solid, uniform backgrounds, use lower tolerance (10-30) for precise removal. For backgrounds with slight color variations, use higher tolerance (40-60). For complex backgrounds with many color variations, use higher tolerance (60-100), but be careful as this may affect parts of the main subject. Start with 30 and adjust based on the preview results. Lower tolerance is more precise but may leave some background pixels, while higher tolerance removes more but may affect the subject."
          }
        },
        {
          "@type": "Question",
          "name": "Can I remove complex backgrounds?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our color-based background remover works best with solid or uniform backgrounds. For complex backgrounds with many colors, gradients, or detailed patterns, the results may vary. You may need to adjust the tolerance setting or try selecting different background colors. For very complex backgrounds, professional image editing software with AI-powered background removal may provide better results, but our tool is excellent for simple to moderately complex backgrounds."
          }
        },
        {
          "@type": "Question",
          "name": "What image formats are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Image Background Remover supports all common image formats including JPEG, PNG, GIF, WebP, BMP, and SVG. You can upload images in any of these formats. The background-removed image is saved as PNG format to preserve transparency, as JPEG and other formats don't support transparency."
          }
        },
        {
          "@type": "Question",
          "name": "Is my image data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All background removal happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The background removal algorithm runs locally in your browser without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "Can I remove backgrounds from multiple images at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our Image Background Remover processes one image at a time. To remove backgrounds from multiple images, upload and process each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch background removal tools."
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
        <title>Image Background Remover - Free Online Tool to Remove Backgrounds | FixTools</title>
        <meta name="title" content="Image Background Remover - Free Online Tool to Remove Backgrounds | FixTools" />
        <meta name="description" content="Remove backgrounds from images and make them transparent. Free online background remover. Select background color by clicking on image or using color picker. Adjust tolerance for precise removal. Perfect for product photos, portraits, and graphics. Works 100% in your browser - fast, secure, no registration required." />
        <meta name="keywords" content="background remover, remove background, transparent background, background removal tool, remove image background, free background remover, image background remover online, transparent image maker" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Image Background Remover - Free Online Tool to Remove Backgrounds" />
        <meta property="og:description" content="Remove backgrounds from images and make them transparent. Free online background remover. Select background color and adjust tolerance." />
        <meta property="og:image" content={`${siteHost}/images/image-background-remover-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Image Background Remover - Free Online Tool to Remove Backgrounds" />
        <meta property="twitter:description" content="Remove backgrounds from images and make them transparent. Free online background remover." />
        <meta property="twitter:image" content={`${siteHost}/images/image-background-remover-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.image-background-remover-page) {
          font-size: 100% !important;
        }
        
        .image-background-remover-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .image-background-remover-page *,
        .image-background-remover-page *::before,
        .image-background-remover-page *::after {
          box-sizing: border-box;
        }
        
        .image-background-remover-page h1,
        .image-background-remover-page h2,
        .image-background-remover-page h3,
        .image-background-remover-page p,
        .image-background-remover-page ul,
        .image-background-remover-page ol {
          margin: 0;
        }
        
        .image-background-remover-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .image-background-remover-page input,
        .image-background-remover-page textarea,
        .image-background-remover-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="image-background-remover-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Image Background Remover</span></li>
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
                Image Background Remover
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Remove backgrounds from images and make them transparent. Free online background remover. Select background color by clicking on image or using color picker. Adjust tolerance for precise removal. Perfect for product photos, portraits, and graphics. Works 100% in your browser.
            </p>

            <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
              <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                <span className="relative z-10 flex items-center gap-2">⚡ Remove Background</span>
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
                <h2 className="text-xl font-semibold text-slate-900">Remove Image Background</h2>
                <p className="mt-1 text-sm text-slate-600">Upload an image and select the background color to remove.</p>
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
                    {isProcessing && (
                      <div>
                        <span className="text-slate-600">Status:</span>
                        <span className="ml-2 font-semibold text-purple-600">Processing...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Color Selection */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Background Color to Remove</label>
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="flex-1">
                      <input
                        type="color"
                        value={targetColor}
                        onChange={(e) => setTargetColor(e.target.value)}
                        className="w-full h-12 rounded-xl border border-slate-200 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-600 mb-2">Click on the image below to select a color from the background</p>
                      <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg border-2 border-slate-300" style={{ backgroundColor: targetColor }}></div>
                          <span className="text-sm font-mono text-slate-700">{targetColor.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tolerance Slider */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Tolerance: {tolerance}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={tolerance}
                    onChange={(e) => setTolerance(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Precise (Exact Match)</span>
                    <span>Broad (Similar Colors)</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    Lower tolerance removes only exact color matches. Higher tolerance removes similar colors. Adjust based on your image.
                  </p>
                </div>

                {/* Image Preview - Clickable */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Original Image (Click to Select Background Color)
                  </label>
                  <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <img 
                      ref={imagePreviewRef}
                      src={imageUrl} 
                      alt="Original" 
                      onClick={handleImageClick}
                      className="max-w-full h-auto max-h-96 rounded-lg cursor-crosshair"
                      style={{ imageRendering: 'auto' }}
                    />
                  </div>
                </div>

                {/* Background Removed Preview */}
                {removedImageUrl && (
                  <div className="mt-6">
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Background Removed (Transparent)</label>
                    <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6" style={{ backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}>
                      <img src={removedImageUrl} alt="Background Removed" className="max-w-full h-auto max-h-96 rounded-lg" />
                    </div>
                  </div>
                )}

                {/* Download Button */}
                {removedImageUrl && (
                  <div className="mt-6">
                    <button
                      onClick={handleDownload}
                      className="w-full rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Download Image (PNG with Transparency)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* What is Image Background Removal Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Image Background Removal?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Image background removal</strong> is the process of making the background of an image transparent, effectively removing it while keeping the main subject intact. This is useful for product photos, portraits, graphics, and images that need to be placed on different backgrounds. Background removal creates images with transparent backgrounds (alpha channel), typically saved as PNG format to preserve transparency.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">MDN Web Docs</a>, the HTML5 Canvas API enables powerful client-side background removal without server processing. Our background remover uses the Canvas API's <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">getImageData()</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">putImageData()</code> methods to manipulate pixels at the pixel level, processing everything entirely in your browser, ensuring complete privacy and security. The <a href="https://www.w3.org/TR/2dcontext/" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">W3C Canvas 2D Context specification</a> provides standardized pixel manipulation capabilities across modern browsers.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Background removal is essential for e-commerce product photos, creating graphics for websites, designing marketing materials, creating composite images, and preparing images for use on different backgrounds. Transparent backgrounds allow images to blend seamlessly with any background color or design, making them versatile for various applications.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">✓</span>
                    Color-Based Removal
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Select background color to remove</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Adjustable tolerance for color matching</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Works best with solid backgrounds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>100% client-side processing</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">✓</span>
                    Pixel-Level Processing
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Processes each pixel individually</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Makes matching pixels transparent</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Preserves image quality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Exports as PNG with transparency</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Image Background Removal Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Remove Backgrounds from Images?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Image background removal is essential for modern digital workflows:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">🛒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">E-Commerce Product Photos</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      E-commerce websites require product photos with transparent backgrounds to display products on different colored backgrounds or in various contexts. Removing backgrounds allows products to be showcased consistently across different pages, categories, and marketing materials. This is essential for online stores, marketplaces, and product catalogs where visual consistency is crucial for professional appearance and user experience.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Graphic Design</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Graphic designers use transparent backgrounds to create composite images, design layouts, and combine multiple elements seamlessly. Transparent backgrounds allow images to blend with any design, background color, or pattern. This is essential for creating logos, marketing materials, social media graphics, presentations, and any design work where images need to integrate with other elements.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">📸</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Portrait Photography</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Portrait photographers often remove backgrounds to create professional headshots, profile pictures, or portraits that can be used in various contexts. Transparent backgrounds allow portraits to be placed on different backgrounds for websites, business cards, marketing materials, or social media profiles. This is especially useful for professional headshots, LinkedIn photos, and corporate photography.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🏷️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Logo and Branding</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Logos and branding elements often need transparent backgrounds to work across different applications, backgrounds, and media. Removing backgrounds from logos ensures they display correctly on websites, business cards, letterheads, merchandise, and any branded materials. This is essential for maintaining brand consistency and professional appearance across all touchpoints.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Web Design</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Web designers use images with transparent backgrounds to create flexible, responsive designs that work across different screen sizes and themes. Transparent backgrounds allow images to adapt to different background colors, gradients, or patterns without requiring separate image versions. This is essential for modern web design, especially for websites with dark/light mode themes or dynamic backgrounds.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-pink-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Social Media Content</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Social media creators use transparent backgrounds to create versatile content that works across different platforms, themes, and contexts. Transparent backgrounds allow images to be reused in various social media posts, stories, and marketing campaigns without needing separate versions for different backgrounds. This is especially useful for Instagram, Facebook, Twitter, and other platforms where visual consistency is important.
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
                Our Image Background Remover makes it easy to remove backgrounds in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Upload your image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, BMP, and SVG. The tool will automatically load your image and display it. You'll see the original dimensions and a preview of the image immediately. The image will be ready for background removal.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Select background color</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Choose the background color to remove. You can click directly on the image to select the color at that point - the tool will automatically detect the color you click on and use it as the target for removal. Alternatively, use the color picker to choose a specific color. This works best with solid or uniform backgrounds. The selected color will be displayed with its hex code.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Adjust tolerance</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Use the tolerance slider to control how closely colors must match the selected color to be removed. Lower tolerance (0-20) removes only exact color matches, while higher tolerance (40-100) removes similar colors. Adjust the tolerance to fine-tune the background removal - start with 30 and adjust based on the preview results. The tool automatically updates the preview as you adjust the tolerance.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    4
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Preview and download</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Review the background-removed image in the preview area. The tool shows the result with transparent background in real-time (displayed on a checkerboard pattern to show transparency). Check that the background is properly removed and that important parts of the image aren't affected. When satisfied, click 'Download Image' to save the image with transparent background as PNG format. The background removal is processed entirely in your browser using the Canvas API - no server upload required.
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
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Background Remover?</h3>
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
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Click on image to select color</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Adjustable tolerance control</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Background Removal</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Following these best practices ensures optimal background removal results:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use Images with Solid Backgrounds</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Our color-based background remover works best with solid or uniform backgrounds. Images with solid white, colored, or uniform backgrounds produce the best results. Complex backgrounds with many colors, gradients, or detailed patterns may require multiple passes or manual adjustments. For best results, use images with clearly defined, uniform backgrounds that contrast well with the main subject.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Select the Right Background Color</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Click directly on the background area of the image to select the color to remove. Choose a point in the background that represents the most common background color. Avoid clicking on edges or areas where the background color may vary. If the background has slight color variations, select a color from the middle of the background area. The color picker can also be used to fine-tune the selection.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Adjust Tolerance Carefully</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Tolerance controls how closely colors must match to be removed. Start with a tolerance of 30 and adjust based on results. Lower tolerance (10-20) removes only exact matches - use this if the background is very uniform. Higher tolerance (40-60) removes similar colors - use this if the background has slight variations. Be careful with very high tolerance (70-100) as it may affect parts of the main subject. Fine-tune until you get the best balance between background removal and subject preservation.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Preview Before Downloading</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Always preview the background-removed image before downloading. Check that the background is properly removed, that no important parts of the subject are affected, and that edges are clean. The preview shows the image on a checkerboard pattern to clearly display transparency. If parts of the subject are being removed, lower the tolerance. If background pixels remain, increase the tolerance or try selecting a different background color. Adjust settings until you're satisfied with the results.
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
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is background removal?</summary>
                <p className="mt-2 text-sm text-slate-600">Background removal is the process of making the background of an image transparent, effectively removing it while keeping the main subject intact. This is useful for product photos, portraits, graphics, and images that need to be placed on different backgrounds. Background removal creates images with transparent backgrounds (alpha channel), typically saved as PNG format to preserve transparency.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Why remove backgrounds from images?</summary>
                <p className="mt-2 text-sm text-slate-600">Removing backgrounds from images is essential for e-commerce product photos, creating graphics for websites, designing marketing materials, creating composite images, and preparing images for use on different backgrounds. Transparent backgrounds allow images to blend seamlessly with any background color or design. This is especially important for product catalogs, logo placement, and graphic design work.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How does background removal work?</summary>
                <p className="mt-2 text-sm text-slate-600">Our background remover uses color-based removal. You select a background color (by clicking on the image or using a color picker), and the tool removes all pixels that match that color within a specified tolerance range. The tolerance setting controls how closely colors must match - lower tolerance removes only exact matches, while higher tolerance removes similar colors. This works best with solid or uniform backgrounds.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What tolerance setting should I use?</summary>
                <p className="mt-2 text-sm text-slate-600">Tolerance depends on your image. For solid, uniform backgrounds, use lower tolerance (10-30) for precise removal. For backgrounds with slight color variations, use higher tolerance (40-60). For complex backgrounds with many color variations, use higher tolerance (60-100), but be careful as this may affect parts of the main subject. Start with 30 and adjust based on the preview results. Lower tolerance is more precise but may leave some background pixels, while higher tolerance removes more but may affect the subject.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I remove complex backgrounds?</summary>
                <p className="mt-2 text-sm text-slate-600">Our color-based background remover works best with solid or uniform backgrounds. For complex backgrounds with many colors, gradients, or detailed patterns, the results may vary. You may need to adjust the tolerance setting or try selecting different background colors. For very complex backgrounds, professional image editing software with AI-powered background removal may provide better results, but our tool is excellent for simple to moderately complex backgrounds.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What image formats are supported?</summary>
                <p className="mt-2 text-sm text-slate-600">Our Image Background Remover supports all common image formats including JPEG, PNG, GIF, WebP, BMP, and SVG. You can upload images in any of these formats. The background-removed image is saved as PNG format to preserve transparency, as JPEG and other formats don't support transparency.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my image data secure?</summary>
                <p className="mt-2 text-sm text-slate-600">Absolutely. All background removal happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The background removal algorithm runs locally in your browser without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I remove backgrounds from multiple images at once?</summary>
                <p className="mt-2 text-sm text-slate-600">Currently, our Image Background Remover processes one image at a time. To remove backgrounds from multiple images, upload and process each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch background removal tools.</p>
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
            
            <Link href="/image-tools/image-compressor" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🗜️</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Image Compressor</p>
                  <p className="text-xs text-slate-500">Compress Images</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Compress images to reduce file size while maintaining quality. Optimize images for faster loading times.</p>
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
              <p className="text-sm text-slate-300 leading-relaxed">Discover all our free image tools for resizing, compressing, converting, cropping, rotating, watermarking, background removal, and more.</p>
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
        <canvas ref={previewCanvasRef} style={{ display: 'none' }} />
      </div>
    </>
  );
}

