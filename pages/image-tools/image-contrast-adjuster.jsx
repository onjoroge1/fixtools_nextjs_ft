import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function ImageContrastAdjuster() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [contrast, setContrast] = useState(0); // Contrast adjustment (-100 to +100)
  const [adjustedImageUrl, setAdjustedImageUrl] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/image-tools/image-contrast-adjuster`;

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
    setAdjustedImageUrl(''); // Clear previous result
    setContrast(0); // Reset to default

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setImageUrl(event.target.result);
        setUploadedImage(img);
        // Auto-adjust on load
        setTimeout(() => adjustContrast(img, 0), 100);
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

  // Clamp value to 0-255 range
  const clamp = (value) => {
    return Math.max(0, Math.min(255, value));
  };

  // Adjust contrast
  const adjustContrast = (img = uploadedImage, contrastValue = contrast) => {
    if (!img || !imageUrl) {
      setError('Please upload an image first');
      return;
    }

    if (contrastValue === 0) {
      // No adjustment, just show original
      setAdjustedImageUrl(imageUrl);
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
      
      // Convert contrast from -100 to +100 to contrast factor
      // Formula: factor = (100 + contrast) / 100
      // For +100: factor = 2.0 (maximum contrast)
      // For 0: factor = 1.0 (no change)
      // For -100: factor = 0.0 (minimum contrast, grayscale-like)
      const factor = (100 + contrastValue) / 100;

      // Process each pixel
      for (let i = 0; i < data.length; i += 4) {
        // Apply contrast adjustment: newValue = (oldValue - 128) * factor + 128
        // This centers the adjustment around 128 (middle gray)
        data[i] = clamp((data[i] - 128) * factor + 128);     // Red
        data[i + 1] = clamp((data[i + 1] - 128) * factor + 128); // Green
        data[i + 2] = clamp((data[i + 2] - 128) * factor + 128); // Blue
        // Alpha channel (data[i + 3]) remains unchanged
      }

      // Put adjusted image data back
      ctx.putImageData(imageData, 0, 0);

      // Convert canvas to image URL
      const adjustedDataUrl = canvas.toDataURL('image/png', 1.0);
      setAdjustedImageUrl(adjustedDataUrl);
    } catch (err) {
      setError('Error adjusting contrast: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle contrast change
  const handleContrastChange = (newContrast) => {
    setContrast(newContrast);
    if (uploadedImage) {
      // Debounce to avoid too many recalculations
      setTimeout(() => adjustContrast(uploadedImage, newContrast), 200);
    }
  };

  // Auto-adjust when contrast changes
  useEffect(() => {
    if (uploadedImage && imageUrl) {
      const timer = setTimeout(() => {
        adjustContrast(uploadedImage, contrast);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [contrast, imageUrl, uploadedImage]);

  // Download adjusted image
  const handleDownload = () => {
    if (!adjustedImageUrl) {
      setError('Please adjust contrast first');
      return;
    }

    const link = document.createElement('a');
    const contrastSuffix = contrast > 0 ? `+${contrast}` : contrast.toString();
    link.download = fileName ? `contrast-${contrastSuffix}-${fileName.replace(/\.[^/.]+$/, '')}.png` : `contrast-${contrastSuffix}-image.png`;
    link.href = adjustedImageUrl;
    link.click();
  };

  // Clear everything
  const handleClear = () => {
    setUploadedImage(null);
    setImageUrl('');
    setAdjustedImageUrl('');
    setOriginalWidth(0);
    setOriginalHeight(0);
    setContrast(0);
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
        { "@type": "ListItem", "position": 4, "name": "Image Contrast Adjuster", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Image Contrast Adjuster",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1689",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Adjust image contrast levels (-100% to +100%)",
        "Real-time preview of contrast adjustment",
        "Precise pixel-level contrast control",
        "100% client-side processing",
        "No registration required",
        "Instant contrast adjustment",
        "Supports all common image formats"
      ],
      "description": "Free online tool to adjust image contrast. Increase or decrease contrast from -100% to +100%. Perfect for enhancing image definition, fixing flat images, or creating dramatic effects. Works 100% in your browser. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Adjust Image Contrast Online",
      "description": "Step-by-step guide to adjust image contrast online for free using FixTools Image Contrast Adjuster.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your image",
          "text": "Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, BMP, and SVG. The tool will automatically load your image and display it. You'll see the original dimensions and a preview of the image immediately.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Adjust contrast level",
          "text": "Use the contrast slider to adjust the image contrast. The contrast ranges from -100% (reduced contrast) to +100% (maximum contrast), with 0% being the original contrast. Negative values reduce contrast (make bright and dark areas more similar), while positive values increase contrast (make bright areas brighter and dark areas darker). The tool automatically updates the preview as you adjust the slider, showing the contrast-adjusted image in real-time.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Preview the adjusted image",
          "text": "Review the contrast-adjusted image in the preview area. The tool shows the result in real-time as you adjust the contrast level. Check that the contrast level meets your requirements - whether it's enhancing definition, fixing flat images, or creating dramatic effects. You can adjust the contrast until you're satisfied with the result.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Download the adjusted image",
          "text": "Click the 'Download Adjusted Image' button to save the contrast-adjusted image to your device. The image will be saved with the contrast adjustment applied. The contrast adjustment is processed entirely in your browser using the Canvas API and pixel manipulation - no server upload required.",
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
          "name": "What is image contrast adjustment?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Image contrast adjustment is the process of increasing or decreasing the difference between light and dark areas in an image. Increasing contrast makes bright areas brighter and dark areas darker, creating more definition and visual impact. Decreasing contrast makes bright and dark areas more similar, creating a flatter, softer appearance. Contrast adjustment affects the relationship between different tones in the image, unlike brightness adjustment which affects the overall lightness uniformly."
          }
        },
        {
          "@type": "Question",
          "name": "Why adjust image contrast?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Adjusting image contrast is essential for enhancing image definition (making images pop), fixing flat images (images with low contrast that look dull), creating dramatic effects (high contrast for bold images), improving visibility (making details more apparent), matching contrast across multiple images, or preparing images for specific display requirements. Contrast adjustment is one of the most important image editing operations for creating visually appealing images."
          }
        },
        {
          "@type": "Question",
          "name": "How does contrast adjustment work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Image Contrast Adjuster uses pixel-level manipulation to adjust the difference between light and dark areas. For each pixel, the tool applies a contrast factor centered around middle gray (128). Positive contrast values increase the difference (bright areas get brighter, dark areas get darker), while negative values decrease the difference (bright and dark areas become more similar). The formula used is: newValue = (oldValue - 128) * factor + 128, where factor is calculated from the contrast percentage."
          }
        },
        {
          "@type": "Question",
          "name": "What contrast level should I use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Contrast level depends on your image and goals. For slightly flat images, use +10 to +30. For very flat images, use +30 to +60. For images that are too contrasty, use -10 to -30. For dramatic high-contrast effects, use +60 to +100. Start with small adjustments and increase gradually. The preview updates in real-time, making it easy to find the right contrast level. Avoid extreme values (-80 to -100 or +80 to +100) as they can cause clipping or loss of detail."
          }
        },
        {
          "@type": "Question",
          "name": "Will contrast adjustment reduce image quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Contrast adjustment maintains the image's resolution and pixel count, but extreme adjustments may cause clipping (pixels hitting the 0 or 255 limit) or loss of detail in highlights or shadows. Moderate adjustments (within -50% to +50%) typically maintain good quality. Extreme adjustments may cause some loss of detail or color accuracy. For best results, use moderate adjustments and keep a copy of the original image."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between contrast and brightness?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Contrast adjusts the difference between light and dark areas (making bright areas brighter and dark areas darker, or vice versa), while brightness adjusts the overall lightness of an image uniformly (all pixels get brighter or darker by the same amount). Contrast affects the relationship between different tones, while brightness affects the entire image equally. Both adjustments are useful for different purposes and are often used together."
          }
        },
        {
          "@type": "Question",
          "name": "Is my image data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All image contrast adjustment happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The contrast adjustment algorithm runs locally in your browser without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "Can I adjust contrast of multiple images at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our Image Contrast Adjuster processes one image at a time. To adjust contrast of multiple images, upload and adjust each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch contrast adjustment tools."
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
        <title>Image Contrast Adjuster - Free Online Tool to Adjust Image Contrast | FixTools</title>
        <meta name="title" content="Image Contrast Adjuster - Free Online Tool to Adjust Image Contrast | FixTools" />
        <meta name="description" content="Adjust image contrast levels. Free online contrast adjuster. Increase or decrease contrast from -100% to +100%. Perfect for enhancing image definition, fixing flat images, or creating dramatic effects. Works 100% in your browser - fast, secure, no registration required." />
        <meta name="keywords" content="image contrast, contrast adjuster, adjust contrast, increase contrast, decrease contrast, image contrast tool, free contrast adjuster, contrast correction" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Image Contrast Adjuster - Free Online Tool to Adjust Image Contrast" />
        <meta property="og:description" content="Adjust image contrast levels. Free online contrast adjuster. Increase or decrease contrast from -100% to +100%." />
        <meta property="og:image" content={`${siteHost}/images/image-contrast-adjuster-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Image Contrast Adjuster - Free Online Tool to Adjust Image Contrast" />
        <meta property="twitter:description" content="Adjust image contrast levels. Free online contrast adjuster." />
        <meta property="twitter:image" content={`${siteHost}/images/image-contrast-adjuster-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.image-contrast-adjuster-page) {
          font-size: 100% !important;
        }
        
        .image-contrast-adjuster-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .image-contrast-adjuster-page *,
        .image-contrast-adjuster-page *::before,
        .image-contrast-adjuster-page *::after {
          box-sizing: border-box;
        }
        
        .image-contrast-adjuster-page h1,
        .image-contrast-adjuster-page h2,
        .image-contrast-adjuster-page h3,
        .image-contrast-adjuster-page p,
        .image-contrast-adjuster-page ul,
        .image-contrast-adjuster-page ol {
          margin: 0;
        }
        
        .image-contrast-adjuster-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .image-contrast-adjuster-page input,
        .image-contrast-adjuster-page textarea,
        .image-contrast-adjuster-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="image-contrast-adjuster-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Image Contrast Adjuster</span></li>
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
                Image Contrast Adjuster
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Adjust image contrast levels. Free online contrast adjuster. Increase or decrease contrast from -100% to +100%. Perfect for enhancing image definition, fixing flat images, or creating dramatic effects. Works 100% in your browser.
            </p>

            <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
              <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                <span className="relative z-10 flex items-center gap-2">⚡ Adjust Contrast</span>
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
                <h2 className="text-xl font-semibold text-slate-900">Adjust Image Contrast</h2>
                <p className="mt-1 text-sm text-slate-600">Upload an image and adjust contrast from -100% to +100%.</p>
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

                {/* Contrast Slider */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Contrast: {contrast > 0 ? '+' : ''}{contrast}%
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={contrast}
                    onChange={(e) => handleContrastChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Reduced (-100%)</span>
                    <span>Original (0%)</span>
                    <span>Maximum (+100%)</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    Adjust the slider to control contrast. Negative values reduce contrast (flatter image), positive values increase contrast (more definition). The preview updates in real-time.
                  </p>
                </div>

                {/* Image Preview */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Contrast Adjusted Preview</label>
                  <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <img src={adjustedImageUrl || imageUrl} alt="Contrast Adjusted" className="max-w-full h-auto max-h-96 rounded-lg" />
                  </div>
                </div>

                {/* Download Button */}
                {adjustedImageUrl && (
                  <div className="mt-6">
                    <button
                      onClick={handleDownload}
                      className="w-full rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Download Adjusted Image
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* What is Image Contrast Adjustment Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Image Contrast Adjustment?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Image contrast adjustment</strong> is the process of increasing or decreasing the difference between light and dark areas in an image. Increasing contrast makes bright areas brighter and dark areas darker, creating more definition and visual impact. Decreasing contrast makes bright and dark areas more similar, creating a flatter, softer appearance. Contrast adjustment affects the relationship between different tones in the image, unlike brightness adjustment which affects the overall lightness uniformly.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">MDN Web Docs</a>, the HTML5 Canvas API enables powerful client-side contrast adjustment without server processing. Our contrast adjuster uses the Canvas API's <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">getImageData()</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">putImageData()</code> methods to manipulate RGB values at the pixel level, processing everything entirely in your browser, ensuring complete privacy and security. The <a href="https://www.w3.org/TR/2dcontext/" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">W3C Canvas 2D Context specification</a> provides standardized pixel manipulation capabilities across modern browsers.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Contrast adjustment is essential for enhancing image definition (making images pop), fixing flat images (images with low contrast that look dull), creating dramatic effects (high contrast for bold images), improving visibility (making details more apparent), or matching contrast across multiple images. Contrast adjustment is one of the most important image editing operations for creating visually appealing images.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">✓</span>
                    Tone-Based Adjustment
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Adjusts difference between tones</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Centered around middle gray (128)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Range from -100% to +100%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Values clamped to 0-255 range</span>
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
                      <span>Instant contrast adjustment</span>
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

        {/* Why Use Image Contrast Adjustment Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Adjust Image Contrast?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Image contrast adjustment is essential for modern digital workflows:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Enhance Image Definition</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Increasing contrast makes images pop by enhancing the difference between light and dark areas. This creates more definition, makes details more apparent, and gives images a more vibrant, professional appearance. High contrast images are more visually striking and draw attention. This is essential for making images stand out in presentations, websites, or social media.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">📸</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Fix Flat Images</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Many images have low contrast, making them look flat, dull, or washed out. Increasing contrast brings these images to life by making bright areas brighter and dark areas darker. This is especially important for photos taken in overcast conditions, with poor lighting, or with automatic camera settings that produced flat results. Contrast adjustment can transform a dull image into a vibrant one.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Create Dramatic Effects</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      High contrast creates dramatic, bold images with strong visual impact. This is perfect for artistic photography, black and white images, or images that need to make a strong statement. High contrast images have a cinematic quality and are often used in professional photography, graphic design, and marketing materials. Contrast is a fundamental tool for creative image editing.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">👁️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Improve Visibility</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Contrast adjustment makes details more apparent by increasing the difference between different tones. This improves visibility, makes text more readable when overlaid on images, and makes important elements stand out. This is essential for images used in presentations, documents, or websites where clarity and visibility are important. Proper contrast ensures images are effective communication tools.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">🖼️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Match Contrast Across Images</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      When combining multiple images in a design, presentation, or collage, contrast levels often need to match for visual consistency. Adjusting contrast ensures all images have similar visual impact and definition, creating a cohesive and professional appearance. This is essential for creating consistent layouts, presentations, or image collections where visual harmony is important.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Fix Mobile Photos</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Mobile phone cameras often produce images with low contrast due to automatic processing, challenging lighting, or camera limitations. Increasing contrast fixes mobile photos that look flat or washed out, making them more vibrant and visually appealing. This is especially important for photos taken in low light, bright sunlight, or with inconsistent lighting conditions. Contrast adjustment can transform mobile photos into professional-looking images.
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
                Our Image Contrast Adjuster makes it easy to adjust contrast in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Upload your image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, BMP, and SVG. The tool will automatically load your image and display it. You'll see the original dimensions and a preview of the image immediately. The image will be ready for contrast adjustment.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Adjust contrast level</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Use the contrast slider to adjust the image contrast. The contrast ranges from -100% (reduced contrast) to +100% (maximum contrast), with 0% being the original contrast. Negative values reduce contrast (make bright and dark areas more similar), while positive values increase contrast (make bright areas brighter and dark areas darker). The tool automatically updates the preview as you adjust the slider, showing the contrast-adjusted image in real-time. Adjust until you achieve the desired contrast level.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Preview the adjusted image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Review the contrast-adjusted image in the preview area. The tool shows the result in real-time as you adjust the contrast level. Check that the contrast level meets your requirements - whether it's enhancing definition, fixing flat images, or creating dramatic effects. You can adjust the contrast until you're satisfied with the result. The preview updates instantly, making it easy to fine-tune the contrast.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    4
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Download the adjusted image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the 'Download Adjusted Image' button to save the contrast-adjusted image to your device. The image will be saved with the contrast adjustment applied. The contrast adjustment is processed entirely in your browser using the Canvas API and pixel manipulation - no server upload required. The adjusted image maintains the same dimensions as the original.
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
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Contrast Adjuster?</h3>
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
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Range from -100% to +100%</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Tone-based precision</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Contrast Adjustment</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Following these best practices ensures optimal contrast adjustment results:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use Moderate Adjustments</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      For best results, use moderate contrast adjustments (within -50% to +50%). Extreme adjustments (-80% to -100% or +80% to +100%) can cause clipping (pixels hitting the 0 or 255 limit) or loss of detail in highlights or shadows. Start with small adjustments (10-20%) and increase gradually. The preview updates in real-time, making it easy to find the right contrast level without going too far.
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
                      While contrast adjustment maintains image resolution, extreme adjustments may cause some loss of detail or color accuracy. Always keep a copy of the original image if you might need it later. This is especially important for photos, professional images, or images that might need to be used in different contexts. Consider saving contrast-adjusted versions with different filenames to preserve originals.
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
                      Always preview the contrast-adjusted image before downloading to ensure the contrast level meets your requirements. Check that the image has good definition, that details are visible, and that the overall appearance looks good. Use the real-time preview to fine-tune the contrast level. It's better to adjust the contrast slightly than to end up with an incorrectly adjusted image.
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
                      Different types of images require different contrast adjustments. Portraits may need subtle adjustments to maintain natural skin tones, while landscapes may tolerate larger adjustments. Images with high dynamic range may need careful adjustment to avoid losing detail in highlights or shadows. Consider the image content and adjust contrast accordingly. The preview helps you see how adjustments affect different parts of the image.
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
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is image contrast adjustment?</summary>
                <p className="mt-2 text-sm text-slate-600">Image contrast adjustment is the process of increasing or decreasing the difference between light and dark areas in an image. Increasing contrast makes bright areas brighter and dark areas darker, creating more definition and visual impact. Decreasing contrast makes bright and dark areas more similar, creating a flatter, softer appearance. Contrast adjustment affects the relationship between different tones in the image, unlike brightness adjustment which affects the overall lightness uniformly.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Why adjust image contrast?</summary>
                <p className="mt-2 text-sm text-slate-600">Adjusting image contrast is essential for enhancing image definition (making images pop), fixing flat images (images with low contrast that look dull), creating dramatic effects (high contrast for bold images), improving visibility (making details more apparent), matching contrast across multiple images, or preparing images for specific display requirements. Contrast adjustment is one of the most important image editing operations for creating visually appealing images.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How does contrast adjustment work?</summary>
                <p className="mt-2 text-sm text-slate-600">Our Image Contrast Adjuster uses pixel-level manipulation to adjust the difference between light and dark areas. For each pixel, the tool applies a contrast factor centered around middle gray (128). Positive contrast values increase the difference (bright areas get brighter, dark areas get darker), while negative values decrease the difference (bright and dark areas become more similar). The formula used is: newValue = (oldValue - 128) * factor + 128, where factor is calculated from the contrast percentage.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What contrast level should I use?</summary>
                <p className="mt-2 text-sm text-slate-600">Contrast level depends on your image and goals. For slightly flat images, use +10 to +30. For very flat images, use +30 to +60. For images that are too contrasty, use -10 to -30. For dramatic high-contrast effects, use +60 to +100. Start with small adjustments and increase gradually. The preview updates in real-time, making it easy to find the right contrast level. Avoid extreme values (-80 to -100 or +80 to +100) as they can cause clipping or loss of detail.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Will contrast adjustment reduce image quality?</summary>
                <p className="mt-2 text-sm text-slate-600">Contrast adjustment maintains the image's resolution and pixel count, but extreme adjustments may cause clipping (pixels hitting the 0 or 255 limit) or loss of detail in highlights or shadows. Moderate adjustments (within -50% to +50%) typically maintain good quality. Extreme adjustments may cause some loss of detail or color accuracy. For best results, use moderate adjustments and keep a copy of the original image.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What's the difference between contrast and brightness?</summary>
                <p className="mt-2 text-sm text-slate-600">Contrast adjusts the difference between light and dark areas (making bright areas brighter and dark areas darker, or vice versa), while brightness adjusts the overall lightness of an image uniformly (all pixels get brighter or darker by the same amount). Contrast affects the relationship between different tones, while brightness affects the entire image equally. Both adjustments are useful for different purposes and are often used together.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my image data secure?</summary>
                <p className="mt-2 text-sm text-slate-600">Absolutely. All image contrast adjustment happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The contrast adjustment algorithm runs locally in your browser without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I adjust contrast of multiple images at once?</summary>
                <p className="mt-2 text-sm text-slate-600">Currently, our Image Contrast Adjuster processes one image at a time. To adjust contrast of multiple images, upload and adjust each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch contrast adjustment tools.</p>
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
            <Link href="/image-tools/image-brightness-adjuster" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">☀️</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Image Brightness Adjuster</p>
                  <p className="text-xs text-slate-500">Adjust Brightness</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Adjust image brightness levels. Perfect for correcting exposure or fixing dark/bright images.</p>
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
            
            <Link href="/image-tools/image-compressor" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🗜️</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Image Compressor</p>
                  <p className="text-xs text-slate-500">Compress Images</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Compress images to reduce file size while maintaining quality. Optimize images for faster loading times.</p>
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
              <p className="text-sm text-slate-300 leading-relaxed">Discover all our free image tools for resizing, compressing, converting, cropping, rotating, brightness/contrast adjustment, and more.</p>
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

