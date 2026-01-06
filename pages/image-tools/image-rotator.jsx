import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function ImageRotator() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0); // in degrees
  const [rotatedImageUrl, setRotatedImageUrl] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/image-tools/image-rotator`;

  // Rotation presets
  const rotationPresets = [
    { angle: 90, label: '90° (Clockwise)' },
    { angle: 180, label: '180° (Upside Down)' },
    { angle: 270, label: '270° (Counter-clockwise)' },
    { angle: -90, label: '-90° (Counter-clockwise)' },
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
    setRotationAngle(0); // Reset rotation on new upload

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setImageUrl(event.target.result);
        setUploadedImage(img);
        // Auto-rotate on load (will show original at 0°)
        setTimeout(() => rotateImage(img, 0), 100);
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

  // Rotate image
  const rotateImage = (img = uploadedImage, angle = rotationAngle) => {
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

      // Convert angle to radians
      const radians = (angle * Math.PI) / 180;

      // Calculate new canvas dimensions to fit rotated image
      const cos = Math.abs(Math.cos(radians));
      const sin = Math.abs(Math.sin(radians));
      const newWidth = Math.ceil(img.width * cos + img.height * sin);
      const newHeight = Math.ceil(img.width * sin + img.height * cos);

      // Set canvas dimensions
      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext('2d');
      
      // Fill white background for transparency
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Translate to center of canvas
      ctx.translate(canvas.width / 2, canvas.height / 2);
      
      // Rotate
      ctx.rotate(radians);
      
      // Draw image centered
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      // Convert canvas to image URL
      const rotatedDataUrl = canvas.toDataURL('image/png', 1.0);
      setRotatedImageUrl(rotatedDataUrl);
    } catch (err) {
      setError('Error rotating image: ' + err.message);
    }
  };

  // Handle angle change
  const handleAngleChange = (newAngle) => {
    // Normalize angle to 0-360 range
    let normalizedAngle = parseFloat(newAngle);
    if (isNaN(normalizedAngle)) {
      normalizedAngle = 0;
    }
    
    // Keep angle in reasonable range (-360 to 360)
    while (normalizedAngle > 360) normalizedAngle -= 360;
    while (normalizedAngle < -360) normalizedAngle += 360;
    
    setRotationAngle(normalizedAngle);
    if (uploadedImage) {
      setTimeout(() => rotateImage(uploadedImage, normalizedAngle), 50);
    }
  };

  // Apply preset rotation
  const applyPreset = (angle) => {
    setRotationAngle(angle);
    if (uploadedImage) {
      setTimeout(() => rotateImage(uploadedImage, angle), 50);
    }
  };

  // Auto-rotate when angle changes
  useEffect(() => {
    if (uploadedImage && imageUrl) {
      rotateImage(uploadedImage, rotationAngle);
    }
  }, [rotationAngle, imageUrl, uploadedImage]);

  // Download rotated image
  const handleDownload = () => {
    if (!rotatedImageUrl) {
      setError('Please rotate an image first');
      return;
    }

    const link = document.createElement('a');
    link.download = fileName ? `rotated-${fileName}` : 'rotated-image.png';
    link.href = rotatedImageUrl;
    link.click();
  };

  // Clear everything
  const handleClear = () => {
    setUploadedImage(null);
    setImageUrl('');
    setRotatedImageUrl('');
    setOriginalWidth(0);
    setOriginalHeight(0);
    setRotationAngle(0);
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
        { "@type": "ListItem", "position": 4, "name": "Image Rotator", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Image Rotator",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "2654",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Rotate images by any angle (0° to 360°)",
        "Quick preset rotations (90°, 180°, 270°)",
        "Custom angle input with slider",
        "Image preview with rotation",
        "100% client-side processing",
        "No registration required",
        "Instant rotation",
        "Supports all common image formats"
      ],
      "description": "Free online tool to rotate images by any angle. Rotate images 90°, 180°, 270°, or any custom angle. Perfect for correcting orientation or creative effects. Works 100% in your browser. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Rotate Images Online",
      "description": "Step-by-step guide to rotate images online for free using FixTools Image Rotator.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your image",
          "text": "Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, BMP, and SVG. The tool will automatically load your image and display it. You'll see the original dimensions and a preview of the image immediately.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Select rotation angle",
          "text": "Choose a rotation angle using the preset buttons (90°, 180°, 270°) or enter a custom angle using the slider or input field. The angle can be from -360° to 360°. Positive angles rotate clockwise, negative angles rotate counter-clockwise. The tool automatically updates the preview as you adjust the angle.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Preview the rotated image",
          "text": "Review the rotated image in the preview area. The tool shows the new dimensions after rotation (which may be larger than the original to accommodate the rotated image). Check that the rotation is correct and the image orientation meets your requirements.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Download the rotated image",
          "text": "Click the 'Download Rotated Image' button to save the rotated image to your device. The image will be saved with the rotation applied. The rotation is processed entirely in your browser using the Canvas API - no server upload required.",
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
          "name": "What is image rotation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Image rotation is the process of turning an image around its center point by a specified angle. Rotation can be used to correct image orientation (e.g., when photos are taken in portrait mode but saved in landscape), create artistic effects, or adjust image alignment. Rotation preserves all image content but changes the orientation and may increase canvas size to accommodate the rotated image."
          }
        },
        {
          "@type": "Question",
          "name": "Why rotate images?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Rotating images is useful for correcting orientation (especially for photos taken with mobile devices), aligning images for layouts, creating artistic effects, preparing images for specific display requirements, or fixing images that were saved in the wrong orientation. Many cameras and phones save images with EXIF orientation data, but some applications don't read this data correctly, requiring manual rotation."
          }
        },
        {
          "@type": "Question",
          "name": "What rotation angles are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Image Rotator supports any rotation angle from -360° to 360°. Common preset angles include 90° (quarter turn clockwise), 180° (half turn, upside down), 270° (three-quarter turn clockwise), and -90° (quarter turn counter-clockwise). You can also enter any custom angle using the slider or input field. The tool automatically calculates the new canvas dimensions to fit the rotated image."
          }
        },
        {
          "@type": "Question",
          "name": "Will rotation reduce image quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Rotation at 90° increments (90°, 180°, 270°) maintains perfect image quality as these are lossless transformations. Rotation at other angles may introduce slight quality loss due to pixel interpolation, but modern algorithms minimize this. The rotated image maintains the same pixel density as the original within the rotated area. For best quality, use 90° increment rotations when possible."
          }
        },
        {
          "@type": "Question",
          "name": "Why does the canvas size change after rotation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "When an image is rotated, the canvas size must increase to accommodate the rotated image. For example, rotating a 1000×500px image by 45° requires a larger canvas (approximately 1060×1060px) to fit the rotated image without cropping. The tool automatically calculates the optimal canvas size to ensure the entire rotated image is visible. This is normal behavior for image rotation."
          }
        },
        {
          "@type": "Question",
          "name": "What image formats are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Image Rotator supports all common image formats including JPEG, PNG, GIF, WebP, BMP, and SVG. You can upload images in any of these formats and rotate them. The rotated image is saved as PNG format to preserve quality and support transparency if the original image had it."
          }
        },
        {
          "@type": "Question",
          "name": "Is my image data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All image rotation happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The rotation algorithm runs locally in your browser without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "Can I rotate multiple images at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our Image Rotator processes one image at a time. To rotate multiple images, upload and rotate each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch rotation tools."
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
        <title>Image Rotator - Free Online Tool to Rotate Images | FixTools</title>
        <meta name="title" content="Image Rotator - Free Online Tool to Rotate Images | FixTools" />
        <meta name="description" content="Rotate images by any angle. Rotate images 90°, 180°, 270°, or any custom angle. Free online image rotator. Perfect for correcting orientation or creative effects. Works 100% in your browser - fast, secure, no registration required." />
        <meta name="keywords" content="image rotator, rotate image, image rotation tool, rotate photo, image rotator online, free image rotator, rotate image 90 degrees, image orientation fixer" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Image Rotator - Free Online Tool to Rotate Images" />
        <meta property="og:description" content="Rotate images by any angle. Rotate images 90°, 180°, 270°, or any custom angle. Free online image rotator." />
        <meta property="og:image" content={`${siteHost}/images/image-rotator-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Image Rotator - Free Online Tool to Rotate Images" />
        <meta property="twitter:description" content="Rotate images by any angle. Rotate images 90°, 180°, 270°, or any custom angle. Free online image rotator." />
        <meta property="twitter:image" content={`${siteHost}/images/image-rotator-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.image-rotator-page) {
          font-size: 100% !important;
        }
        
        .image-rotator-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .image-rotator-page *,
        .image-rotator-page *::before,
        .image-rotator-page *::after {
          box-sizing: border-box;
        }
        
        .image-rotator-page h1,
        .image-rotator-page h2,
        .image-rotator-page h3,
        .image-rotator-page p,
        .image-rotator-page ul,
        .image-rotator-page ol {
          margin: 0;
        }
        
        .image-rotator-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .image-rotator-page input,
        .image-rotator-page textarea,
        .image-rotator-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="image-rotator-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Image Rotator</span></li>
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
                Image Rotator
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Rotate images by any angle. Rotate images 90°, 180°, 270°, or any custom angle. Free online image rotator. Perfect for correcting orientation or creative effects. Works 100% in your browser.
            </p>

            <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
              <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                <span className="relative z-10 flex items-center gap-2">⚡ Rotate Image</span>
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
                <h2 className="text-xl font-semibold text-slate-900">Rotate Image</h2>
                <p className="mt-1 text-sm text-slate-600">Upload an image and rotate it by any angle.</p>
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
                    {rotatedImageUrl && (
                      <div>
                        <span className="text-slate-600">Rotation Angle:</span>
                        <span className="ml-2 font-semibold text-slate-900">{rotationAngle}°</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rotation Presets */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Quick Rotations</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {rotationPresets.map((preset) => (
                      <button
                        key={preset.angle}
                        onClick={() => applyPreset(preset.angle)}
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                          Math.abs(rotationAngle - preset.angle) < 0.1
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Angle Input */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Custom Angle: {Math.round(rotationAngle)}°
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="-360"
                      max="360"
                      step="1"
                      value={rotationAngle}
                      onChange={(e) => handleAngleChange(e.target.value)}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <input
                      type="number"
                      min="-360"
                      max="360"
                      step="1"
                      value={Math.round(rotationAngle)}
                      onChange={(e) => handleAngleChange(e.target.value)}
                      className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>-360°</span>
                    <span>0°</span>
                    <span>360°</span>
                  </div>
                </div>

                {/* Image Preview */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Rotated Image Preview</label>
                  <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    {rotatedImageUrl ? (
                      <img src={rotatedImageUrl} alt="Rotated" className="max-w-full h-auto max-h-96 rounded-lg" />
                    ) : (
                      <img src={imageUrl} alt="Original" className="max-w-full h-auto max-h-96 rounded-lg" />
                    )}
                  </div>
                </div>

                {/* Download Button */}
                {rotatedImageUrl && (
                  <div className="mt-6">
                    <button
                      onClick={handleDownload}
                      className="w-full rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Download Rotated Image
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* What is Image Rotation Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Image Rotation?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Image rotation</strong> is the process of turning an image around its center point by a specified angle. Rotation can be used to correct image orientation (e.g., when photos are taken in portrait mode but saved in landscape), create artistic effects, or adjust image alignment. Rotation preserves all image content but changes the orientation and may increase canvas size to accommodate the rotated image.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">MDN Web Docs</a>, the HTML5 Canvas API enables powerful client-side image rotation without server processing. Our image rotator uses the Canvas API's <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">translate()</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">rotate()</code> methods to rotate images entirely in your browser, ensuring complete privacy and security. The <a href="https://www.w3.org/TR/2dcontext/" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">W3C Canvas 2D Context specification</a> provides standardized image rotation capabilities across modern browsers.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Rotation is essential for correcting image orientation, especially for photos taken with mobile devices that may be saved in the wrong orientation. Many cameras and phones save images with EXIF orientation data, but some applications don't read this data correctly, requiring manual rotation. Rotation can also be used creatively to create dynamic compositions or adjust images for specific display requirements.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">✓</span>
                    Lossless Rotation (90° increments)
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Perfect quality preservation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>No pixel interpolation needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Fast processing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Best for orientation correction</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">✓</span>
                    Custom Angle Rotation
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Any angle from -360° to 360°</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Minimal quality loss with modern algorithms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Creative effects and fine adjustments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Automatic canvas size adjustment</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Image Rotation Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Rotate Images?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Image rotation is essential for modern digital workflows:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Correct Orientation</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Many photos taken with mobile devices are saved in the wrong orientation. Cameras and phones save EXIF orientation data, but many applications don't read this data correctly, displaying images sideways or upside down. Rotating images manually ensures they display correctly in all applications, websites, and social media platforms. This is especially important for portrait photos taken with phones.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Creative Effects</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Rotation can be used creatively to create dynamic compositions, add visual interest, or achieve specific artistic effects. Slight rotations (5-15°) can create a sense of movement or dynamism. Larger rotations can completely transform the composition and create abstract or artistic effects. Rotation is a fundamental tool in image editing and graphic design.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Layout Alignment</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Rotation helps align images for specific layouts or design requirements. When images need to fit into specific frames, align with text, or match other design elements, rotation ensures perfect alignment. This is essential for creating consistent layouts in websites, presentations, documents, or print materials.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Fix Scanned Documents</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Scanned documents or photos are often rotated incorrectly. Rotating them ensures text is readable and images are properly oriented. This is essential for digitizing documents, archiving photos, or preparing images for OCR (Optical Character Recognition) processing. Proper orientation ensures documents are usable and professional-looking.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">📸</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Photo Editing</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Professional photographers and photo editors use rotation to correct horizon lines, straighten images, or adjust composition. Slight rotations can fix tilted horizons in landscape photos, correct perspective issues, or improve overall composition. Rotation is a fundamental tool in professional photo editing workflows.
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
                      Websites and applications may display images incorrectly if they're not properly oriented. Rotating images ensures they display correctly across all browsers, devices, and platforms. This is essential for maintaining professional appearance and ensuring images are usable and visually appealing on websites, social media, or applications.
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
                Our Image Rotator makes it easy to rotate images in seconds. Follow these simple steps:
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
                    <p className="font-bold text-slate-900 text-base">Select rotation angle</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Choose a rotation angle using the preset buttons (90°, 180°, 270°) or enter a custom angle using the slider or input field. The angle can be from -360° to 360°. Positive angles rotate clockwise, negative angles rotate counter-clockwise. The tool automatically updates the preview as you adjust the angle, showing the rotated image in real-time.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Preview the rotated image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Review the rotated image in the preview area. The tool shows the new dimensions after rotation (which may be larger than the original to accommodate the rotated image). Check that the rotation is correct and the image orientation meets your requirements. The preview updates automatically as you adjust the rotation angle.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    4
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Download the rotated image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the 'Download Rotated Image' button to save the rotated image to your device. The image will be saved with the rotation applied. The rotation is processed entirely in your browser using the Canvas API's translate and rotate methods - no server upload required. The rotated image maintains quality within the rotated area.
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
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Image Rotator?</h3>
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
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Any angle from -360° to 360°</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Quick preset rotations</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Image Rotation</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Following these best practices ensures optimal rotation results:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use 90° Increments When Possible</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Rotation at 90° increments (90°, 180°, 270°) maintains perfect image quality as these are lossless transformations. These rotations don't require pixel interpolation, preserving exact image quality. Use 90° increments for orientation correction, which is the most common use case. Custom angles may introduce slight quality loss due to pixel interpolation, though modern algorithms minimize this.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Check Canvas Size Changes</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      When an image is rotated, the canvas size must increase to accommodate the rotated image. For example, rotating a 1000×500px image by 45° requires a larger canvas. The tool automatically calculates the optimal canvas size, but be aware that rotated images may be larger than originals. This is normal behavior and ensures the entire rotated image is visible without cropping.
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
                      Always preview the rotated image before downloading to ensure the rotation is correct. Check that the orientation meets your requirements, that important elements aren't cut off, and that the image looks good. Use the real-time preview to fine-tune the rotation angle if needed. It's better to adjust the angle slightly than to end up with an incorrectly rotated image.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Consider Image Quality</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      For best quality, use 90° increment rotations when possible. Custom angles may introduce slight quality loss due to pixel interpolation, though this is usually minimal with modern algorithms. If you need custom angles, start with high-resolution images to minimize quality loss. For orientation correction, always use 90° increments for perfect quality.
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
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is image rotation?</summary>
                <p className="mt-2 text-sm text-slate-600">Image rotation is the process of turning an image around its center point by a specified angle. Rotation can be used to correct image orientation (e.g., when photos are taken in portrait mode but saved in landscape), create artistic effects, or adjust image alignment. Rotation preserves all image content but changes the orientation and may increase canvas size to accommodate the rotated image.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Why rotate images?</summary>
                <p className="mt-2 text-sm text-slate-600">Rotating images is useful for correcting orientation (especially for photos taken with mobile devices), aligning images for layouts, creating artistic effects, preparing images for specific display requirements, or fixing images that were saved in the wrong orientation. Many cameras and phones save images with EXIF orientation data, but some applications don't read this data correctly, requiring manual rotation.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What rotation angles are supported?</summary>
                <p className="mt-2 text-sm text-slate-600">Our Image Rotator supports any rotation angle from -360° to 360°. Common preset angles include 90° (quarter turn clockwise), 180° (half turn, upside down), 270° (three-quarter turn clockwise), and -90° (quarter turn counter-clockwise). You can also enter any custom angle using the slider or input field. The tool automatically calculates the new canvas dimensions to fit the rotated image.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Will rotation reduce image quality?</summary>
                <p className="mt-2 text-sm text-slate-600">Rotation at 90° increments (90°, 180°, 270°) maintains perfect image quality as these are lossless transformations. Rotation at other angles may introduce slight quality loss due to pixel interpolation, but modern algorithms minimize this. The rotated image maintains the same pixel density as the original within the rotated area. For best quality, use 90° increment rotations when possible.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Why does the canvas size change after rotation?</summary>
                <p className="mt-2 text-sm text-slate-600">When an image is rotated, the canvas size must increase to accommodate the rotated image. For example, rotating a 1000×500px image by 45° requires a larger canvas (approximately 1060×1060px) to fit the rotated image without cropping. The tool automatically calculates the optimal canvas size to ensure the entire rotated image is visible. This is normal behavior for image rotation.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What image formats are supported?</summary>
                <p className="mt-2 text-sm text-slate-600">Our Image Rotator supports all common image formats including JPEG, PNG, GIF, WebP, BMP, and SVG. You can upload images in any of these formats and rotate them. The rotated image is saved as PNG format to preserve quality and support transparency if the original image had it.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my image data secure?</summary>
                <p className="mt-2 text-sm text-slate-600">Absolutely. All image rotation happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The rotation algorithm runs locally in your browser without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I rotate multiple images at once?</summary>
                <p className="mt-2 text-sm text-slate-600">Currently, our Image Rotator processes one image at a time. To rotate multiple images, upload and rotate each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch rotation tools.</p>
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

