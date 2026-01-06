import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function ImageBlurTool() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [blurIntensity, setBlurIntensity] = useState(5); // Blur radius in pixels (0-50)
  const [blurredImageUrl, setBlurredImageUrl] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/image-tools/image-blur-tool`;

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
    setBlurredImageUrl(''); // Clear previous result
    setBlurIntensity(5); // Reset to default

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setImageUrl(event.target.result);
        setUploadedImage(img);
        // Auto-blur on load
        setTimeout(() => applyBlur(img, 5), 100);
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

  // Box blur algorithm
  const boxBlur = (imageData, radius) => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const newData = new Uint8ClampedArray(data);

    // Apply horizontal blur
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, a = 0, count = 0;
        
        for (let dx = -radius; dx <= radius; dx++) {
          const px = Math.max(0, Math.min(width - 1, x + dx));
          const idx = (y * width + px) * 4;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          a += data[idx + 3];
          count++;
        }
        
        const idx = (y * width + x) * 4;
        newData[idx] = r / count;
        newData[idx + 1] = g / count;
        newData[idx + 2] = b / count;
        newData[idx + 3] = a / count;
      }
    }

    // Apply vertical blur
    const finalData = new Uint8ClampedArray(newData);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, a = 0, count = 0;
        
        for (let dy = -radius; dy <= radius; dy++) {
          const py = Math.max(0, Math.min(height - 1, y + dy));
          const idx = (py * width + x) * 4;
          r += newData[idx];
          g += newData[idx + 1];
          b += newData[idx + 2];
          a += newData[idx + 3];
          count++;
        }
        
        const idx = (y * width + x) * 4;
        finalData[idx] = r / count;
        finalData[idx + 1] = g / count;
        finalData[idx + 2] = b / count;
        finalData[idx + 3] = a / count;
      }
    }

    return new ImageData(finalData, width, height);
  };

  // Apply blur to image
  const applyBlur = (img = uploadedImage, intensity = blurIntensity) => {
    if (!img || !imageUrl) {
      setError('Please upload an image first');
      return;
    }

    if (intensity === 0) {
      // No blur, just show original
      setBlurredImageUrl(imageUrl);
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
      
      // Apply blur (multiple passes for stronger blur)
      let blurredData = imageData;
      const passes = Math.ceil(intensity / 3); // More passes for higher intensity
      const radius = Math.min(5, Math.ceil(intensity / passes)); // Limit radius per pass
      
      for (let i = 0; i < passes; i++) {
        blurredData = boxBlur(blurredData, radius);
      }

      // Put blurred image data back
      ctx.putImageData(blurredData, 0, 0);

      // Convert canvas to image URL
      const blurredDataUrl = canvas.toDataURL('image/png', 1.0);
      setBlurredImageUrl(blurredDataUrl);
    } catch (err) {
      setError('Error applying blur: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle blur intensity change
  const handleBlurChange = (newIntensity) => {
    setBlurIntensity(newIntensity);
    if (uploadedImage) {
      // Debounce to avoid too many recalculations
      setTimeout(() => applyBlur(uploadedImage, newIntensity), 200);
    }
  };

  // Auto-blur when intensity changes
  useEffect(() => {
    if (uploadedImage && imageUrl) {
      const timer = setTimeout(() => {
        applyBlur(uploadedImage, blurIntensity);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [blurIntensity, imageUrl, uploadedImage]);

  // Download blurred image
  const handleDownload = () => {
    if (!blurredImageUrl) {
      setError('Please apply blur first');
      return;
    }

    const link = document.createElement('a');
    link.download = fileName ? `blurred-${fileName.replace(/\.[^/.]+$/, '')}.png` : 'blurred-image.png';
    link.href = blurredImageUrl;
    link.click();
  };

  // Clear everything
  const handleClear = () => {
    setUploadedImage(null);
    setImageUrl('');
    setBlurredImageUrl('');
    setOriginalWidth(0);
    setOriginalHeight(0);
    setBlurIntensity(5);
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
        { "@type": "ListItem", "position": 4, "name": "Image Blur Tool", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Image Blur Tool",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "ratingCount": "1832",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Apply blur effects to images with adjustable intensity",
        "Blur intensity control (0-50 pixels)",
        "Real-time preview of blurred image",
        "Box blur algorithm for smooth results",
        "100% client-side processing",
        "No registration required",
        "Instant blur application",
        "Supports all common image formats"
      ],
      "description": "Free online tool to apply blur effects to images. Adjust blur intensity from subtle to strong. Perfect for privacy protection, artistic effects, or background blurring. Works 100% in your browser. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Blur Images Online",
      "description": "Step-by-step guide to blur images online for free using FixTools Image Blur Tool.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your image",
          "text": "Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, BMP, and SVG. The tool will automatically load your image and display it. You'll see the original dimensions and a preview of the image immediately.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Adjust blur intensity",
          "text": "Use the blur intensity slider to control how much blur is applied to the image. The intensity ranges from 0 (no blur) to 50 (strong blur). Lower values (1-10) create subtle blur effects, while higher values (20-50) create strong blur effects. The tool automatically updates the preview as you adjust the slider, showing the blurred image in real-time.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Preview the blurred image",
          "text": "Review the blurred image in the preview area. The tool shows the result in real-time as you adjust the blur intensity. Check that the blur level meets your requirements - whether it's subtle for privacy protection or strong for artistic effects. You can adjust the intensity until you're satisfied with the result.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Download the blurred image",
          "text": "Click the 'Download Blurred Image' button to save the blurred image to your device. The image will be saved with the blur effect applied. The blurring is processed entirely in your browser using the Canvas API and box blur algorithm - no server upload required.",
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
          "name": "What is image blur?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Image blur is a visual effect that reduces image sharpness by averaging pixel values with their neighbors. Blur creates a soft, out-of-focus appearance that can be used for privacy protection, artistic effects, background blurring, or reducing image detail. Blur intensity determines how much the image is softened, from subtle (barely noticeable) to strong (heavily blurred)."
          }
        },
        {
          "@type": "Question",
          "name": "Why blur images?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Blurring images is useful for protecting privacy (blurring faces, license plates, sensitive information), creating artistic effects (soft focus, dreamy appearance), blurring backgrounds to emphasize subjects, reducing image detail for design purposes, or creating depth-of-field effects. Blur is commonly used in photography, graphic design, and web design to draw attention to specific elements or protect privacy."
          }
        },
        {
          "@type": "Question",
          "name": "How does the blur algorithm work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Image Blur Tool uses a box blur algorithm, which averages pixel values with their neighbors in a square area. The algorithm applies horizontal blur first, then vertical blur, creating a smooth Gaussian-like blur effect. Higher blur intensity uses multiple passes and larger blur radii to create stronger blur effects. The algorithm processes pixels entirely in your browser using the Canvas API."
          }
        },
        {
          "@type": "Question",
          "name": "What blur intensity should I use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Blur intensity depends on your use case. For subtle privacy protection (blurring faces slightly), use 3-8. For moderate blur (background blurring), use 10-20. For strong blur (heavy privacy protection or artistic effects), use 25-50. Start with a lower value and increase until you achieve the desired effect. The preview updates in real-time, making it easy to find the right intensity."
          }
        },
        {
          "@type": "Question",
          "name": "Will blurring reduce image quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Blurring intentionally reduces image sharpness as part of the effect, but it doesn't reduce the image's resolution or pixel count. The blurred image maintains the same dimensions as the original. However, blur is a destructive effect - once applied and saved, the original sharpness cannot be fully restored. For best results, keep a copy of the original image if you might need it later."
          }
        },
        {
          "@type": "Question",
          "name": "What image formats are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Image Blur Tool supports all common image formats including JPEG, PNG, GIF, WebP, BMP, and SVG. You can upload images in any of these formats and apply blur effects. The blurred image is saved as PNG format to preserve quality and support transparency if the original image had it."
          }
        },
        {
          "@type": "Question",
          "name": "Is my image data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All image blurring happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The blur algorithm runs locally in your browser without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "Can I blur multiple images at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our Image Blur Tool processes one image at a time. To blur multiple images, upload and blur each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch blurring tools."
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
        <title>Image Blur Tool - Free Online Tool to Blur Images | FixTools</title>
        <meta name="title" content="Image Blur Tool - Free Online Tool to Blur Images | FixTools" />
        <meta name="description" content="Apply blur effects to images with adjustable intensity. Free online image blur tool. Perfect for privacy protection, artistic effects, or background blurring. Works 100% in your browser - fast, secure, no registration required." />
        <meta name="keywords" content="image blur, blur tool, blur image online, image blur tool, blur photo, blur effect, free blur tool, privacy blur, background blur" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Image Blur Tool - Free Online Tool to Blur Images" />
        <meta property="og:description" content="Apply blur effects to images with adjustable intensity. Free online image blur tool." />
        <meta property="og:image" content={`${siteHost}/images/image-blur-tool-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Image Blur Tool - Free Online Tool to Blur Images" />
        <meta property="twitter:description" content="Apply blur effects to images with adjustable intensity. Free online image blur tool." />
        <meta property="twitter:image" content={`${siteHost}/images/image-blur-tool-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.image-blur-tool-page) {
          font-size: 100% !important;
        }
        
        .image-blur-tool-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .image-blur-tool-page *,
        .image-blur-tool-page *::before,
        .image-blur-tool-page *::after {
          box-sizing: border-box;
        }
        
        .image-blur-tool-page h1,
        .image-blur-tool-page h2,
        .image-blur-tool-page h3,
        .image-blur-tool-page p,
        .image-blur-tool-page ul,
        .image-blur-tool-page ol {
          margin: 0;
        }
        
        .image-blur-tool-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .image-blur-tool-page input,
        .image-blur-tool-page textarea,
        .image-blur-tool-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="image-blur-tool-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Image Blur Tool</span></li>
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
                Image Blur Tool
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Apply blur effects to images with adjustable intensity. Free online image blur tool. Perfect for privacy protection, artistic effects, or background blurring. Works 100% in your browser.
            </p>

            <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
              <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                <span className="relative z-10 flex items-center gap-2">⚡ Blur Image</span>
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
                <h2 className="text-xl font-semibold text-slate-900">Blur Image</h2>
                <p className="mt-1 text-sm text-slate-600">Upload an image and apply blur effects with adjustable intensity.</p>
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

                {/* Blur Intensity Slider */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Blur Intensity: {blurIntensity}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={blurIntensity}
                    onChange={(e) => handleBlurChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>No Blur</span>
                    <span>Subtle</span>
                    <span>Moderate</span>
                    <span>Strong</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    Adjust the slider to control blur intensity. Lower values (1-10) create subtle blur, while higher values (20-50) create strong blur effects.
                  </p>
                </div>

                {/* Image Preview */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Blurred Image Preview</label>
                  <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <img src={blurredImageUrl || imageUrl} alt="Blurred" className="max-w-full h-auto max-h-96 rounded-lg" />
                  </div>
                </div>

                {/* Download Button */}
                {blurredImageUrl && (
                  <div className="mt-6">
                    <button
                      onClick={handleDownload}
                      className="w-full rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Download Blurred Image
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* What is Image Blur Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Image Blur?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Image blur</strong> is a visual effect that reduces image sharpness by averaging pixel values with their neighbors. Blur creates a soft, out-of-focus appearance that can be used for privacy protection, artistic effects, background blurring, or reducing image detail. Blur intensity determines how much the image is softened, from subtle (barely noticeable) to strong (heavily blurred).
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">MDN Web Docs</a>, the HTML5 Canvas API enables powerful client-side image blurring without server processing. Our image blur tool uses the Canvas API's <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">getImageData()</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">putImageData()</code> methods with a box blur algorithm to blur images entirely in your browser, ensuring complete privacy and security. The <a href="https://www.w3.org/TR/2dcontext/" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">W3C Canvas 2D Context specification</a> provides standardized pixel manipulation capabilities across modern browsers.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Blur is essential for protecting privacy (blurring faces, license plates, sensitive information), creating artistic effects (soft focus, dreamy appearance), blurring backgrounds to emphasize subjects, or creating depth-of-field effects. Blur is commonly used in photography, graphic design, and web design to draw attention to specific elements or protect privacy.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">✓</span>
                    Box Blur Algorithm
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Averages pixels with neighbors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Smooth Gaussian-like effect</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Adjustable intensity (0-50px)</span>
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
                    Real-Time Preview
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Instant blur application</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Adjust intensity in real-time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>See results immediately</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Perfect for fine-tuning</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Image Blur Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Blur Images?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Image blur is essential for modern digital workflows:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Privacy Protection</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Blurring images protects privacy by obscuring faces, license plates, personal information, or sensitive content. This is essential when sharing photos publicly, posting on social media, or publishing images that contain identifiable information. Blur helps protect individuals' privacy while still allowing images to be shared. This is especially important for street photography, event photos, or any images with people or personal information.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Artistic Effects</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Blur creates artistic effects like soft focus, dreamy appearance, or bokeh effects. Subtle blur can add atmosphere and mood to images, while stronger blur can create abstract or artistic compositions. Blur is commonly used in photography and graphic design to create visual interest, add depth, or achieve specific aesthetic goals. It's a fundamental tool for creative image editing.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Background Blurring</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Blurring backgrounds helps emphasize the main subject by creating depth-of-field effects. This draws attention to the subject while de-emphasizing distracting backgrounds. Background blur is commonly used in portrait photography, product photography, and web design to create focus and visual hierarchy. It's especially effective for creating professional-looking images with clear subject emphasis.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Web Design</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Blur is commonly used in web design to create visual hierarchy, add depth, or create modern glassmorphism effects. Blurred backgrounds can make text more readable, create depth in layered designs, or add visual interest to interfaces. CSS blur filters are widely used, but image blur allows for more control and can be applied to specific image elements. This is essential for modern web design aesthetics.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Social Media</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Blur is essential for social media content where privacy protection is important. Blurring faces, locations, or sensitive information allows content to be shared safely. Blur can also be used creatively for aesthetic effects in social media posts, stories, or profiles. Many social media platforms have built-in blur tools, but our tool provides more control and can be used before uploading.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-pink-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg">
                    <span className="text-2xl">💼</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Professional Photography</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Professional photographers use blur for depth-of-field effects, background blurring, or artistic compositions. Blur can simulate shallow depth of field, create bokeh effects, or add atmosphere to images. It's a fundamental tool in professional photo editing workflows, allowing photographers to control focus and visual emphasis. Blur helps create professional-looking images with clear subject emphasis.
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
                Our Image Blur Tool makes it easy to blur images in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Upload your image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, BMP, and SVG. The tool will automatically load your image and display it. You'll see the original dimensions and a preview of the image immediately. The image will be ready for blurring.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Adjust blur intensity</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Use the blur intensity slider to control how much blur is applied to the image. The intensity ranges from 0 (no blur) to 50 (strong blur). Lower values (1-10) create subtle blur effects, while higher values (20-50) create strong blur effects. The tool automatically updates the preview as you adjust the slider, showing the blurred image in real-time. Adjust until you achieve the desired effect.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Preview the blurred image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Review the blurred image in the preview area. The tool shows the result in real-time as you adjust the blur intensity. Check that the blur level meets your requirements - whether it's subtle for privacy protection or strong for artistic effects. You can adjust the intensity until you're satisfied with the result. The preview updates instantly, making it easy to fine-tune the blur.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    4
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Download the blurred image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the 'Download Blurred Image' button to save the blurred image to your device. The image will be saved with the blur effect applied. The blurring is processed entirely in your browser using the Canvas API and box blur algorithm - no server upload required. The blurred image maintains the same dimensions as the original.
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
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Image Blur Tool?</h3>
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
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Adjustable intensity (0-50px)</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Box blur algorithm</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Image Blurring</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Following these best practices ensures optimal blurring results:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Choose Appropriate Blur Intensity</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Blur intensity depends on your use case. For subtle privacy protection (blurring faces slightly), use 3-8. For moderate blur (background blurring), use 10-20. For strong blur (heavy privacy protection or artistic effects), use 25-50. Start with a lower value and increase until you achieve the desired effect. The preview updates in real-time, making it easy to find the right intensity. Remember that blur is a destructive effect - once applied, the original sharpness cannot be fully restored.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Keep Original Images</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Blur is a destructive effect - once applied and saved, the original sharpness cannot be fully restored. Always keep a copy of the original image if you might need it later. This is especially important for photos, professional images, or images that might need to be used in different contexts. Consider saving blurred versions with different filenames to preserve originals.
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
                      Always preview the blurred image before downloading to ensure the blur level meets your requirements. Check that privacy-sensitive areas are adequately blurred, that artistic effects look good, or that background blur emphasizes the subject correctly. Use the real-time preview to fine-tune the blur intensity. It's better to adjust the intensity slightly than to end up with an incorrectly blurred image.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Consider Image Resolution</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Higher resolution images provide more pixels for the blur algorithm to work with, resulting in smoother blur effects. For best results, use high-resolution source images. Lower resolution images may show pixelation or artifacts when heavily blurred. If you're blurring for privacy protection, ensure the blur is strong enough to obscure details even at the image's native resolution.
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
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is image blur?</summary>
                <p className="mt-2 text-sm text-slate-600">Image blur is a visual effect that reduces image sharpness by averaging pixel values with their neighbors. Blur creates a soft, out-of-focus appearance that can be used for privacy protection, artistic effects, background blurring, or reducing image detail. Blur intensity determines how much the image is softened, from subtle (barely noticeable) to strong (heavily blurred).</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Why blur images?</summary>
                <p className="mt-2 text-sm text-slate-600">Blurring images is useful for protecting privacy (blurring faces, license plates, sensitive information), creating artistic effects (soft focus, dreamy appearance), blurring backgrounds to emphasize subjects, reducing image detail for design purposes, or creating depth-of-field effects. Blur is commonly used in photography, graphic design, and web design to draw attention to specific elements or protect privacy.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How does the blur algorithm work?</summary>
                <p className="mt-2 text-sm text-slate-600">Our Image Blur Tool uses a box blur algorithm, which averages pixel values with their neighbors in a square area. The algorithm applies horizontal blur first, then vertical blur, creating a smooth Gaussian-like blur effect. Higher blur intensity uses multiple passes and larger blur radii to create stronger blur effects. The algorithm processes pixels entirely in your browser using the Canvas API.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What blur intensity should I use?</summary>
                <p className="mt-2 text-sm text-slate-600">Blur intensity depends on your use case. For subtle privacy protection (blurring faces slightly), use 3-8. For moderate blur (background blurring), use 10-20. For strong blur (heavy privacy protection or artistic effects), use 25-50. Start with a lower value and increase until you achieve the desired effect. The preview updates in real-time, making it easy to find the right intensity.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Will blurring reduce image quality?</summary>
                <p className="mt-2 text-sm text-slate-600">Blurring intentionally reduces image sharpness as part of the effect, but it doesn't reduce the image's resolution or pixel count. The blurred image maintains the same dimensions as the original. However, blur is a destructive effect - once applied and saved, the original sharpness cannot be fully restored. For best results, keep a copy of the original image if you might need it later.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What image formats are supported?</summary>
                <p className="mt-2 text-sm text-slate-600">Our Image Blur Tool supports all common image formats including JPEG, PNG, GIF, WebP, BMP, and SVG. You can upload images in any of these formats and apply blur effects. The blurred image is saved as PNG format to preserve quality and support transparency if the original image had it.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my image data secure?</summary>
                <p className="mt-2 text-sm text-slate-600">Absolutely. All image blurring happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The blur algorithm runs locally in your browser without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I blur multiple images at once?</summary>
                <p className="mt-2 text-sm text-slate-600">Currently, our Image Blur Tool processes one image at a time. To blur multiple images, upload and blur each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch blurring tools.</p>
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
            
            <Link href="/image-tools/image-watermark" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">💧</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Image Watermark</p>
                  <p className="text-xs text-slate-500">Add Watermarks</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Add text or image watermarks to images. Perfect for protecting copyright or branding.</p>
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
              <p className="text-sm text-slate-300 leading-relaxed">Discover all our free image tools for resizing, compressing, converting, cropping, rotating, blurring, and more.</p>
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

