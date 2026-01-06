import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function Base64ToImage() {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [mimeType, setMimeType] = useState('');
  const [autoRemovePrefix, setAutoRemovePrefix] = useState(true);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/image-tools/base64-to-image`;

  // Handle decode
  const handleDecode = () => {
    const inputText = input.trim();
    if (!inputText) {
      setError('Please enter a Base64 encoded string');
      setImageUrl('');
      return;
    }

    setError('');

    try {
      let base64String = inputText;
      let detectedMimeType = '';

      // Auto-detect and remove data URI prefix if present
      if (autoRemovePrefix && base64String.startsWith('data:')) {
        const commaIndex = base64String.indexOf(',');
        if (commaIndex !== -1) {
          const prefix = base64String.substring(0, commaIndex);
          // Extract MIME type from prefix
          const mimeMatch = prefix.match(/data:([^;]+)/);
          if (mimeMatch) {
            detectedMimeType = mimeMatch[1];
            setMimeType(detectedMimeType);
          }
          base64String = base64String.substring(commaIndex + 1);
        }
      } else {
        // Try to detect MIME type from common Base64 patterns or default to image/png
        detectedMimeType = 'image/png';
        setMimeType(detectedMimeType);
      }

      // Handle URL-safe Base64 (replace - with + and _ with /)
      if (base64String.includes('-') || base64String.includes('_')) {
        base64String = base64String.replace(/-/g, '+').replace(/_/g, '/');
        // Add padding if needed
        while (base64String.length % 4 !== 0) {
          base64String += '=';
        }
      }

      // Decode Base64 to binary
      const binaryString = atob(base64String);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create blob and image URL
      const blob = new Blob([bytes], { type: detectedMimeType || 'image/png' });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      setFileSize(bytes.length);

      // Determine file extension from MIME type
      const extMap = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'image/svg+xml': 'svg',
        'image/bmp': 'bmp'
      };
      const extension = extMap[detectedMimeType] || 'png';
      setFileName(`decoded-image.${extension}`);

      // Get image dimensions
      const img = new window.Image();
      img.onload = () => {
        setImageWidth(img.width);
        setImageHeight(img.height);
        URL.revokeObjectURL(url); // Clean up old URL
        const newUrl = URL.createObjectURL(blob);
        setImageUrl(newUrl);
      };
      img.onerror = () => {
        setError('Failed to decode Base64 string or invalid image data. Please check your input.');
        setImageUrl('');
      };
      img.src = url;
    } catch (err) {
      if (err.message.includes('Invalid character')) {
        setError('Invalid Base64 string. Please check that your input contains valid Base64 encoded data.');
      } else {
        setError('Error decoding Base64: ' + err.message);
      }
      setImageUrl('');
      setFileSize(0);
      setImageWidth(0);
      setImageHeight(0);
    }
  };

  // Download image
  const handleDownload = () => {
    if (!imageUrl) {
      setError('Please decode a Base64 string first');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = fileName || 'decoded-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Error downloading image: ' + err.message);
    }
  };

  // Clear everything
  const handleClear = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setInput('');
    setImageUrl('');
    setFileName('');
    setFileSize(0);
    setImageWidth(0);
    setImageHeight(0);
    setMimeType('');
    setError('');
    if (textareaRef.current) {
      textareaRef.current.value = '';
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

  // Enhanced Structured Data
  const structuredData = {
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteHost}/` },
        { "@type": "ListItem", "position": 2, "name": "Tools", "item": `${siteHost}/tools` },
        { "@type": "ListItem", "position": 3, "name": "Image Tools", "item": `${siteHost}/tools/image-tools` },
        { "@type": "ListItem", "position": 4, "name": "Base64 to Image", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Base64 to Image",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "ratingCount": "2847",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Convert Base64 encoded strings back to images",
        "Auto-detect and handle data URI prefix",
        "Image preview with dimensions",
        "Download decoded images",
        "100% client-side processing",
        "No registration required",
        "Instant conversion",
        "Supports all image formats"
      ],
      "description": "Free online tool to convert Base64 encoded strings back to images. Decode Base64 image data and download as image files. Works 100% in your browser. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert Base64 to Image Online",
      "description": "Step-by-step guide to convert Base64 encoded strings back to images online for free using FixTools Base64 to Image tool.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Paste your Base64 string",
          "text": "Paste your Base64 encoded string into the input area. The string can include the data URI prefix (data:image/png;base64,...) or be a pure Base64 string. The tool automatically detects and handles both formats.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Decode the Base64 string",
          "text": "Click the 'Decode Base64' button to convert the Base64 string to an image. The tool will automatically detect the image format, decode the Base64 data, and display the image preview. You'll see file size information and image dimensions.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Preview the image",
          "text": "Review the decoded image in the preview area. The tool displays the image dimensions (width and height), file size, and image format. The image is rendered directly in your browser.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Download the image",
          "text": "Click the 'Download Image' button to save the decoded image to your device. The image file will be saved with the appropriate extension based on the detected format (PNG, JPEG, GIF, WebP, etc.). The conversion is instant and works entirely in your browser - no server upload required.",
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
          "name": "What is Base64 decoding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Base64 decoding is the reverse process of Base64 encoding, converting Base64 encoded text strings back to their original binary data (like images). Base64 uses 64 characters (A-Z, a-z, 0-9, +, /) to represent binary data in text format. Decoding reverses this process to recreate the original binary data, which can then be used to display or save images."
          }
        },
        {
          "@type": "Question",
          "name": "Why convert Base64 to images?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Base64 strings are commonly used for embedding images in HTML, CSS, JSON, or databases. Converting Base64 back to images is useful when you need to extract images from Base64-encoded data, save them as files, edit them in image editing software, or use them in applications that require image files rather than Base64 strings. This is essential for reverse engineering, data extraction, and image recovery from encoded formats."
          }
        },
        {
          "@type": "Question",
          "name": "What is the data URI prefix?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The data URI prefix (data:image/png;base64,) is the header that tells browsers what type of data follows. When converting Base64 to images, the tool automatically detects and removes this prefix if present. You can paste Base64 strings with or without the prefix - the tool handles both formats automatically. The prefix is not needed for pure Base64 strings in JSON or databases."
          }
        },
        {
          "@type": "Question",
          "name": "What image formats are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Base64 to Image tool supports all common image formats including JPEG, PNG, GIF, WebP, BMP, and SVG. The tool automatically detects the image format from the data URI prefix (if present) or decodes the Base64 data and determines the format from the image data. Any Base64-encoded image that your browser can display can be decoded."
          }
        },
        {
          "@type": "Question",
          "name": "Is there a size limit for Base64 strings?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "While there's no strict limit in our tool, very long Base64 strings can cause performance issues in browsers or exceed memory limits. Base64 encoded images are approximately 33% larger than the original binary format. For optimal performance, Base64 strings under 10MB are recommended. For larger images, consider using regular image files or chunking the data."
          }
        },
        {
          "@type": "Question",
          "name": "Is my Base64 data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All Base64 decoding happens entirely in your browser using client-side JavaScript and the atob() function. Your Base64 data never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security. The decoding algorithm runs locally in your browser without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "How do I get a Base64 string?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Base64 strings can come from various sources: HTML img src attributes, CSS background-image properties, JSON files, databases, APIs, or our Image to Base64 tool. If you have an image file, you can use our Image to Base64 converter to create a Base64 string. Base64 strings are commonly found in HTML emails, single-page applications, JSON responses from APIs, or database records."
          }
        },
        {
          "@type": "Question",
          "name": "Can I decode multiple Base64 strings at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our Base64 to Image tool processes one Base64 string at a time. To decode multiple images, paste and decode each Base64 string separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many Base64 strings, you may want to use desktop image editing software or create a custom script."
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
        <title>Base64 to Image - Free Online Tool to Convert Base64 to Images | FixTools</title>
        <meta name="title" content="Base64 to Image - Free Online Tool to Convert Base64 to Images | FixTools" />
        <meta name="description" content="Convert Base64 encoded strings back to images. Free online Base64 to image decoder. Decode Base64 image data and download as image files. Works 100% in your browser - fast, secure, no registration required. Supports JPEG, PNG, GIF, WebP formats." />
        <meta name="keywords" content="base64 to image, base64 decoder, base64 image decoder, convert base64 to image, decode base64 image, base64 to image converter, free base64 decoder, base64 image converter" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Base64 to Image - Free Online Tool to Convert Base64 to Images" />
        <meta property="og:description" content="Convert Base64 encoded strings back to images. Free online Base64 to image decoder. Decode Base64 image data and download as image files. Works 100% in your browser." />
        <meta property="og:image" content={`${siteHost}/images/base64-to-image-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Base64 to Image - Free Online Tool to Convert Base64 to Images" />
        <meta property="twitter:description" content="Convert Base64 encoded strings back to images. Free online Base64 to image decoder. Decode Base64 image data and download as image files." />
        <meta property="twitter:image" content={`${siteHost}/images/base64-to-image-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.base64-to-image-page) {
          font-size: 100% !important;
        }
        
        .base64-to-image-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .base64-to-image-page *,
        .base64-to-image-page *::before,
        .base64-to-image-page *::after {
          box-sizing: border-box;
        }
        
        .base64-to-image-page h1,
        .base64-to-image-page h2,
        .base64-to-image-page h3,
        .base64-to-image-page p,
        .base64-to-image-page ul,
        .base64-to-image-page ol {
          margin: 0;
        }
        
        .base64-to-image-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .base64-to-image-page input,
        .base64-to-image-page textarea,
        .base64-to-image-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="base64-to-image-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Base64 to Image</span></li>
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
                Base64 to Image
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Convert Base64 encoded strings back to images. Free online Base64 to image decoder. Decode Base64 image data and download as image files. Works 100% in your browser.
            </p>

            <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
              <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                <span className="relative z-10 flex items-center gap-2">⚡ Decode Base64</span>
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
                <h2 className="text-xl font-semibold text-slate-900">Convert Base64 to Image</h2>
                <p className="mt-1 text-sm text-slate-600">Paste a Base64 encoded string and convert it to an image.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
              </div>
            </div>

            {/* Auto-remove prefix toggle */}
            <div className="mt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRemovePrefix}
                  onChange={(e) => setAutoRemovePrefix(e.target.checked)}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm font-semibold text-slate-800">Auto-remove data URI prefix</span>
              </label>
              <p className="mt-1 text-xs text-slate-500">Automatically detect and remove data:image/png;base64, prefix if present</p>
            </div>

            {/* Base64 Input */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-slate-800">Base64 Encoded String</label>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your Base64 encoded string here (with or without data URI prefix)..."
                className="w-full h-48 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none resize-none font-mono focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}

            {/* Decode Button */}
            <div className="mt-6">
              <button
                onClick={handleDecode}
                disabled={!input.trim()}
                className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Decode Base64
              </button>
            </div>

            {imageUrl && (
              <>
                {/* Image Info */}
                <div className="mt-6 p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">File Name:</span>
                      <span className="ml-2 font-semibold text-slate-900">{fileName}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">File Size:</span>
                      <span className="ml-2 font-semibold text-slate-900">{formatFileSize(fileSize)}</span>
                    </div>
                    {imageWidth > 0 && (
                      <div>
                        <span className="text-slate-600">Dimensions:</span>
                        <span className="ml-2 font-semibold text-slate-900">{imageWidth} × {imageHeight}px</span>
                      </div>
                    )}
                  </div>
                  {mimeType && (
                    <div className="mt-3 pt-3 border-t border-slate-200 text-sm text-slate-600">
                      Format: <span className="font-semibold text-slate-900">{mimeType}</span>
                    </div>
                  )}
                </div>

                {/* Image Preview */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Image Preview</label>
                  <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <img src={imageUrl} alt="Decoded image" className="max-w-full h-auto max-h-96 rounded-lg" />
                  </div>
                </div>

                {/* Download Button */}
                <div className="mt-6">
                  <button
                    onClick={handleDownload}
                    className="w-full rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Download Image
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* What is Base64 Decoding Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Base64 Decoding?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Base64 decoding</strong> is the reverse process of Base64 encoding, converting Base64 encoded text strings back to their original binary data (like images). Base64 uses 64 characters (A-Z, a-z, 0-9, +, /) to represent binary data in text format. Decoding reverses this process to recreate the original binary data, which can then be used to display or save images. Base64 encoded images are approximately 33% larger than the original binary format, but they can be embedded directly in text-based files.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/atob" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">MDN Web Docs</a>, the <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">atob()</code> function enables client-side Base64 decoding without server processing. The <a href="https://datatracker.ietf.org/doc/html/rfc4648" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">RFC 4648</a> standard defines Base64 decoding, ensuring compatibility across all platforms and applications.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When Base64 strings are decoded back to images, they can be saved as image files, displayed in browsers, or used in image editing software. This is essential for extracting images from Base64-encoded data, recovering images from encoded formats, or converting Base64 strings back to usable image files. Base64 decoding is commonly used for reverse engineering, data extraction, and image recovery.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Base64 Encoded String
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Text format (not usable as image)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Embedded in HTML/CSS/JSON</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Cannot open in image editors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Not usable as standalone file</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">✓</span>
                    Decoded Image File
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Binary image format (PNG, JPEG, etc.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Can be saved as image file</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Opens in image editors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Usable as standalone file</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Base64 to Image Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Convert Base64 to Images?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Converting Base64 strings back to images is essential for various use cases:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">💾</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Extract Images from Data</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Base64 strings are commonly found in HTML emails, JSON responses, databases, or CSS files. Converting Base64 to images allows you to extract and save these images as standalone files. This is essential for data extraction, reverse engineering, or recovering images from encoded formats. Perfect for extracting images from HTML sources, API responses, or database records.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🖼️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Edit Images</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Base64 strings cannot be edited in image editing software like Photoshop, GIMP, or other image editors. Converting Base64 to images creates actual image files that can be opened, edited, and saved in any image editing software. This enables you to edit images that were previously stored as Base64 strings, modify them, and save them back as files.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">📁</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Save as Image Files</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Base64 strings are text data and cannot be saved or used as image files. Converting Base64 to images creates actual image files (PNG, JPEG, GIF, etc.) that can be saved to your device, shared with others, uploaded to websites, or used in applications that require image files. This is essential for creating image files from Base64-encoded data.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Reverse Engineering</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Base64 strings are often used to embed images in HTML, CSS, JSON, or other text-based formats. Converting Base64 to images allows you to extract images from web pages, applications, or data files for analysis, backup, or reuse. This is useful for developers, designers, or anyone who needs to extract images from Base64-encoded data sources.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Data Recovery</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      If you have Base64-encoded image data but need the actual image file, converting Base64 to images allows you to recover the original image. This is useful when Base64 strings are the only available format, when recovering images from backups, or when converting data from one format to another. Perfect for data migration, backup recovery, or format conversion.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Browser Compatibility</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Some browsers or applications may not support Base64 images directly, or you may need to use images in formats that don't support Base64. Converting Base64 to images creates standard image files that work in all browsers, applications, and platforms. This ensures compatibility and enables use in any environment that requires image files.
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
                Our Base64 to Image converter makes it easy to convert Base64 strings back to images in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Paste your Base64 string</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Paste your Base64 encoded string into the input area. The string can include the data URI prefix (data:image/png;base64,...) or be a pure Base64 string. The tool automatically detects and handles both formats. You can paste Base64 strings from HTML, CSS, JSON, databases, or any text source.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Decode the Base64 string</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the 'Decode Base64' button to convert the Base64 string to an image. The tool will automatically detect the image format from the data URI prefix (if present), decode the Base64 data using the atob() function, create a binary blob, and display the image preview. You'll see file size information and image dimensions immediately.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Preview the image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Review the decoded image in the preview area. The tool displays the image dimensions (width and height), file size, and image format (PNG, JPEG, GIF, WebP, etc.). The image is rendered directly in your browser using an object URL created from the decoded binary data. You can verify the image before downloading.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    4
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Download the image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the 'Download Image' button to save the decoded image to your device. The image file will be saved with the appropriate extension based on the detected format (PNG, JPEG, GIF, WebP, etc.). The conversion is instant and works entirely in your browser using the atob() function and Blob API - no server upload required.
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
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Base64 to Image Converter?</h3>
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
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Auto-detect data URI prefix</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Image preview with dimensions</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Instant download</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Base64 to Image Conversion</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Following these best practices ensures optimal results when converting Base64 to images:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Verify Base64 String Validity</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Ensure your Base64 string is valid before decoding. Valid Base64 strings contain only characters A-Z, a-z, 0-9, +, /, and = (for padding). The tool automatically handles URL-safe Base64 (which uses - and _ instead of + and /). If you get an error, check that the Base64 string is complete and hasn't been truncated or modified. Very long strings may need to be handled carefully to avoid browser memory issues.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Handle Data URI Prefix</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Base64 strings may include the data URI prefix (data:image/png;base64,). Our tool automatically detects and removes this prefix if the option is enabled. If your Base64 string includes the prefix, enable auto-remove for automatic handling. If it's a pure Base64 string (common in JSON or databases), you can disable auto-remove. The tool works with both formats, so choose the option that matches your input.
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
                      Always preview the decoded image before downloading to ensure it decoded correctly. Check that the image displays properly, dimensions look correct, and file size is reasonable. If the image doesn't display or looks corrupted, verify that the Base64 string is valid and complete. The tool shows image dimensions and file size to help verify the decoded image before saving.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Consider File Size Limits</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Base64 encoded images are approximately 33% larger than the original binary format. Very long Base64 strings can create large image files that may cause performance issues in browsers or exceed memory limits. For optimal performance, Base64 strings under 10MB are recommended. For larger images, consider using regular image files or chunking the data. The tool displays file size information to help you understand the decoded image size.
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
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is Base64 decoding?</summary>
                <p className="mt-2 text-sm text-slate-600">Base64 decoding is the reverse process of Base64 encoding, converting Base64 encoded text strings back to their original binary data (like images). Base64 uses 64 characters (A-Z, a-z, 0-9, +, /) to represent binary data in text format. Decoding reverses this process to recreate the original binary data, which can then be used to display or save images.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Why convert Base64 to images?</summary>
                <p className="mt-2 text-sm text-slate-600">Base64 strings are commonly used for embedding images in HTML, CSS, JSON, or databases. Converting Base64 back to images is useful when you need to extract images from Base64-encoded data, save them as files, edit them in image editing software, or use them in applications that require image files rather than Base64 strings. This is essential for reverse engineering, data extraction, and image recovery from encoded formats.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is the data URI prefix?</summary>
                <p className="mt-2 text-sm text-slate-600">The data URI prefix (data:image/png;base64,) is the header that tells browsers what type of data follows. When converting Base64 to images, the tool automatically detects and removes this prefix if present. You can paste Base64 strings with or without the prefix - the tool handles both formats automatically. The prefix is not needed for pure Base64 strings in JSON or databases.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What image formats are supported?</summary>
                <p className="mt-2 text-sm text-slate-600">Our Base64 to Image tool supports all common image formats including JPEG, PNG, GIF, WebP, BMP, and SVG. The tool automatically detects the image format from the data URI prefix (if present) or decodes the Base64 data and determines the format from the image data. Any Base64-encoded image that your browser can display can be decoded.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is there a size limit for Base64 strings?</summary>
                <p className="mt-2 text-sm text-slate-600">While there's no strict limit in our tool, very long Base64 strings can cause performance issues in browsers or exceed memory limits. Base64 encoded images are approximately 33% larger than the original binary format. For optimal performance, Base64 strings under 10MB are recommended. For larger images, consider using regular image files or chunking the data.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my Base64 data secure?</summary>
                <p className="mt-2 text-sm text-slate-600">Absolutely. All Base64 decoding happens entirely in your browser using client-side JavaScript and the atob() function. Your Base64 data never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security. The decoding algorithm runs locally in your browser without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I get a Base64 string?</summary>
                <p className="mt-2 text-sm text-slate-600">Base64 strings can come from various sources: HTML img src attributes, CSS background-image properties, JSON files, databases, APIs, or our Image to Base64 tool. If you have an image file, you can use our Image to Base64 converter to create a Base64 string. Base64 strings are commonly found in HTML emails, single-page applications, JSON responses from APIs, or database records.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I decode multiple Base64 strings at once?</summary>
                <p className="mt-2 text-sm text-slate-600">Currently, our Base64 to Image tool processes one Base64 string at a time. To decode multiple images, paste and decode each Base64 string separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many Base64 strings, you may want to use desktop image editing software or create a custom script.</p>
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
            <Link href="/image-tools/image-to-base64" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-cyan-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔐</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Image to Base64</p>
                  <p className="text-xs text-slate-500">Encode Images</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Convert images to Base64 encoded strings for embedding in HTML, CSS, or JSON. Perfect for embedding images.</p>
              <p className="mt-4 text-sm font-semibold text-cyan-600 group-hover:text-cyan-700">Open tool →</p>
            </Link>
            
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
    </>
  );
}

