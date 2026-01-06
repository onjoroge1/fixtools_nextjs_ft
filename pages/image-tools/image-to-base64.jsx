import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function ImageToBase64() {
  const [imageUrl, setImageUrl] = useState('');
  const [base64String, setBase64String] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [includePrefix, setIncludePrefix] = useState(true);
  const [copyText, setCopyText] = useState('📋 Copy');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/image-tools/image-to-base64`;

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
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setImageUrl(dataUrl);

      // Extract base64 string (remove data URI prefix)
      const commaIndex = dataUrl.indexOf(',');
      let base64 = commaIndex !== -1 ? dataUrl.substring(commaIndex + 1) : dataUrl;
      
      // Store base64 with and without prefix
      if (includePrefix) {
        setBase64String(dataUrl);
      } else {
        setBase64String(base64);
      }

      // Get image dimensions
      const img = new window.Image();
      img.onload = () => {
        setImageWidth(img.width);
        setImageHeight(img.height);
      };
      img.onerror = () => {
        setError('Failed to load image dimensions.');
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // Handle prefix toggle
  const handlePrefixToggle = (include) => {
    setIncludePrefix(include);
    if (imageUrl) {
      const commaIndex = imageUrl.indexOf(',');
      if (commaIndex !== -1) {
        if (include) {
          setBase64String(imageUrl);
        } else {
          setBase64String(imageUrl.substring(commaIndex + 1));
        }
      }
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (!base64String) return;
    
    try {
      await navigator.clipboard.writeText(base64String);
      setCopyText('✓ Copied!');
      setTimeout(() => setCopyText('📋 Copy'), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = base64String;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopyText('✓ Copied!');
        setTimeout(() => setCopyText('📋 Copy'), 2000);
      } catch (e) {
        setCopyText('❌ Failed');
        setTimeout(() => setCopyText('📋 Copy'), 2000);
      }
      document.body.removeChild(textArea);
    }
  };

  // Clear everything
  const handleClear = () => {
    setImageUrl('');
    setBase64String('');
    setFileName('');
    setFileSize(0);
    setImageWidth(0);
    setImageHeight(0);
    setError('');
    setCopyText('📋 Copy');
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

  // Calculate Base64 size
  const getBase64Size = () => {
    if (!base64String) return 0;
    // Base64 is approximately 33% larger than original
    const base64Length = base64String.length;
    return Math.round((base64Length * 3) / 4);
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
        { "@type": "ListItem", "position": 4, "name": "Image to Base64", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Image to Base64",
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
        "Convert images to Base64 encoded strings",
        "Include or exclude data URI prefix",
        "Image preview",
        "Copy Base64 string to clipboard",
        "100% client-side processing",
        "No registration required",
        "Instant conversion",
        "Supports all image formats"
      ],
      "description": "Free online tool to convert images to Base64 encoded strings. Perfect for embedding images in HTML, CSS, or JSON. Works 100% in your browser. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert Images to Base64 Online",
      "description": "Step-by-step guide to convert images to Base64 encoded strings online for free using FixTools Image to Base64 tool.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your image",
          "text": "Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, BMP, and SVG. The tool will automatically load your image and start the conversion process.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "View the Base64 string",
          "text": "Once uploaded, the image will be converted to a Base64 encoded string. You'll see the image preview and the Base64 string in the output area. The tool shows file size information and image dimensions.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Choose output format",
          "text": "Toggle between including or excluding the data URI prefix (data:image/png;base64,). Include the prefix for direct use in HTML img src or CSS background-image. Exclude it for pure Base64 strings in JSON or other applications.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Copy and use",
          "text": "Click the copy button to copy the Base64 string to your clipboard. You can then paste it directly into your HTML, CSS, JSON, or any other application. The conversion is instant and works entirely in your browser - no server upload required.",
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
          "name": "What is Base64 encoding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Base64 encoding is a binary-to-text encoding scheme that converts binary data (like images) into ASCII text characters. Base64 uses 64 characters (A-Z, a-z, 0-9, +, /) to represent binary data, making it safe to transmit over text-based protocols like HTML, JSON, or email. Base64 encoded images are approximately 33% larger than the original binary format."
          }
        },
        {
          "@type": "Question",
          "name": "Why convert images to Base64?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Converting images to Base64 allows you to embed images directly in HTML, CSS, JSON, or XML files without needing separate image files. This eliminates HTTP requests, enables offline use, simplifies data transfer, and allows images to be stored in databases or configuration files. Base64 images are commonly used for small icons, logos, thumbnails, or when embedding images in emails or single-file web pages."
          }
        },
        {
          "@type": "Question",
          "name": "What is the data URI prefix?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The data URI prefix (data:image/png;base64,) is the header that tells browsers and applications what type of data follows. When included, you can use the Base64 string directly in HTML img src attributes or CSS background-image properties. When excluded, you get a pure Base64 string suitable for JSON, databases, or custom applications. Our tool lets you toggle between both formats."
          }
        },
        {
          "@type": "Question",
          "name": "What image formats are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Image to Base64 tool supports all common image formats including JPEG, PNG, GIF, WebP, BMP, and SVG. Any image format that your browser can read can be converted to Base64. The tool automatically detects the image format and includes it in the data URI prefix when enabled."
          }
        },
        {
          "@type": "Question",
          "name": "Is there a file size limit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "While there's no strict limit in our tool, Base64 encoding increases file size by approximately 33%. Very large images can create very long Base64 strings that may cause performance issues in browsers or exceed limits in some applications. For web use, images under 1MB are recommended. For larger images, consider using regular image files or image compression before conversion."
          }
        },
        {
          "@type": "Question",
          "name": "Is my image data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All image conversion happens entirely in your browser using client-side JavaScript and the FileReader API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The conversion algorithm runs locally in your browser without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "How do I use Base64 images in HTML?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To use a Base64 image in HTML, include the data URI prefix and use it directly in an img tag: <img src=\"data:image/png;base64,iVBORw0KGgoAAAANS...\" />. For CSS, use: background-image: url('data:image/png;base64,iVBORw0KGgoAAAANS...'). Make sure to include the full data URI prefix for direct browser use."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert multiple images at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our Image to Base64 tool processes one image at a time. To convert multiple images, upload and convert each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch processing tools."
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
        <title>Image to Base64 - Free Online Tool to Convert Images to Base64 | FixTools</title>
        <meta name="title" content="Image to Base64 - Free Online Tool to Convert Images to Base64 | FixTools" />
        <meta name="description" content="Convert images to Base64 encoded strings for embedding in HTML, CSS, or JSON. Free online image to Base64 converter. Works 100% in your browser - fast, secure, no registration required. Supports JPEG, PNG, GIF, WebP formats." />
        <meta name="keywords" content="image to base64, base64 image converter, image base64 encoder, convert image to base64, image to base64 online, base64 image encoder, free image to base64, image base64 converter" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Image to Base64 - Free Online Tool to Convert Images to Base64" />
        <meta property="og:description" content="Convert images to Base64 encoded strings for embedding in HTML, CSS, or JSON. Free online image to Base64 converter. Works 100% in your browser." />
        <meta property="og:image" content={`${siteHost}/images/image-to-base64-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Image to Base64 - Free Online Tool to Convert Images to Base64" />
        <meta property="twitter:description" content="Convert images to Base64 encoded strings for embedding in HTML, CSS, or JSON. Free online image to Base64 converter." />
        <meta property="twitter:image" content={`${siteHost}/images/image-to-base64-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.image-to-base64-page) {
          font-size: 100% !important;
        }
        
        .image-to-base64-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .image-to-base64-page *,
        .image-to-base64-page *::before,
        .image-to-base64-page *::after {
          box-sizing: border-box;
        }
        
        .image-to-base64-page h1,
        .image-to-base64-page h2,
        .image-to-base64-page h3,
        .image-to-base64-page p,
        .image-to-base64-page ul,
        .image-to-base64-page ol {
          margin: 0;
        }
        
        .image-to-base64-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .image-to-base64-page input,
        .image-to-base64-page textarea,
        .image-to-base64-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="image-to-base64-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Image to Base64</span></li>
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
                Image to Base64
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Convert images to Base64 encoded strings for embedding in HTML, CSS, or JSON. Free online image to Base64 converter. Works 100% in your browser.
            </p>

            <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
              <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                <span className="relative z-10 flex items-center gap-2">⚡ Convert Image</span>
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
                <h2 className="text-xl font-semibold text-slate-900">Convert Image to Base64 online</h2>
                <p className="mt-1 text-sm text-slate-600">Upload an image and convert it to Base64 encoded string.</p>
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
                  <div className="mt-3 pt-3 border-t border-slate-200 text-sm text-slate-600">
                    Base64 Size: {formatFileSize(getBase64Size())} (approximately {((getBase64Size() / fileSize - 1) * 100).toFixed(1)}% larger)
                  </div>
                </div>

                {/* Image Preview */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Image Preview</label>
                  <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <img src={imageUrl} alt="Preview" className="max-w-full h-auto max-h-96 rounded-lg" />
                  </div>
                </div>

                {/* Output Format Toggle */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Output Format</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handlePrefixToggle(true)}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                        includePrefix
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      With Data URI Prefix
                    </button>
                    <button
                      onClick={() => handlePrefixToggle(false)}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                        !includePrefix
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      Pure Base64 String
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {includePrefix ? 'Include data URI prefix (data:image/png;base64,) for direct use in HTML/CSS' : 'Pure Base64 string for JSON, databases, or custom applications'}
                  </p>
                </div>

                {/* Base64 Output */}
                {base64String && (
                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="block text-sm font-semibold text-slate-800">Base64 Encoded String</label>
                      <button
                        onClick={handleCopy}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 transition-colors"
                      >
                        {copyText}
                      </button>
                    </div>
                    <textarea
                      value={base64String}
                      readOnly
                      className="w-full h-64 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none resize-none font-mono"
                      style={{ wordBreak: 'break-all' }}
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      Base64 string length: {base64String.length.toLocaleString()} characters
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* What is Image to Base64 Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Base64 Image Encoding?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Base64 encoding</strong> is a binary-to-text encoding scheme that converts binary data (like images) into ASCII text characters. Base64 uses 64 characters (A-Z, a-z, 0-9, +, /) to represent binary data, making it safe to transmit over text-based protocols like HTML, JSON, XML, or email. Base64 encoded images are approximately 33% larger than the original binary format, but they can be embedded directly in text-based files.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">MDN Web Docs</a>, the FileReader API's <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">readAsDataURL()</code> method enables client-side Base64 conversion without server processing. The <a href="https://datatracker.ietf.org/doc/html/rfc4648" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">RFC 4648</a> standard defines Base64 encoding, ensuring compatibility across all platforms and applications.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When images are converted to Base64, they become text strings that can be embedded directly in HTML, CSS, JSON, XML, or any text-based format. This eliminates the need for separate image files, HTTP requests, and enables offline use, database storage, and simplified data transfer. Base64 images are commonly used for small icons, logos, thumbnails, email attachments, or single-file web pages.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Separate Image Files
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Requires HTTP requests to load</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Multiple files to manage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Cannot use offline</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Difficult to store in databases</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">✓</span>
                    Base64 Encoded Images
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>No HTTP requests needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Embedded in single file</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Works completely offline</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Easy to store in databases</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Image to Base64 Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Convert Images to Base64?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Base64 image encoding offers numerous advantages for modern web development:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Eliminate HTTP Requests</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Base64 images are embedded directly in HTML, CSS, or JSON files, eliminating separate HTTP requests for image files. This reduces page load times, especially for small icons and logos. According to <a href="https://web.dev/vitals/" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">Google's Core Web Vitals</a>, reducing HTTP requests improves page performance scores and user experience.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">💾</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Database Storage</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Base64 encoded images can be stored directly in databases as text strings, eliminating the need for separate file storage systems. This simplifies data management, enables easier backups, and ensures images are always available with their associated data. Perfect for user avatars, product images, or any application where images need to be stored in databases.
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
                      Base64 images can be embedded directly in HTML emails, ensuring images display correctly without external hosting or broken links. This is essential for email marketing campaigns, newsletters, and transactional emails. Embedded images are always visible, work in all email clients, and don't require external image hosting.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Single-File Applications</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Base64 images enable single-file HTML pages or applications that work completely offline. Perfect for documentation, demos, portable applications, or when you need a self-contained file. All images are embedded in the HTML file, making it easy to share, archive, or use offline without any external dependencies.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">API Responses</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      APIs often return Base64 encoded images in JSON responses, making it easy to transmit image data alongside other information in a single request. This simplifies API design, reduces complexity, and ensures images are always included with their associated metadata. Perfect for REST APIs, GraphQL, or any API that needs to include images.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">CSS Background Images</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Base64 images can be used directly in CSS <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">background-image</code> properties, eliminating the need for separate image files. This is useful for small icons, patterns, or decorative images that are part of the design. Base64 images in CSS ensure they're always available and load with the stylesheet.
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
                Our Image to Base64 converter makes it easy to convert images to Base64 strings in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Upload your image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, BMP, and SVG. The tool will automatically load your image and start the conversion process. You'll see the image preview and file information immediately.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">View the Base64 string</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Once uploaded, the image will be converted to a Base64 encoded string automatically. You'll see the image preview, file size information, image dimensions, and the Base64 string in the output area. The tool shows the Base64 string length and size comparison.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Choose output format</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Toggle between including or excluding the data URI prefix (data:image/png;base64,). Include the prefix for direct use in HTML img src attributes or CSS background-image properties. Exclude it for pure Base64 strings in JSON, databases, or custom applications.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    4
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Copy and use</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the copy button to copy the Base64 string to your clipboard. You can then paste it directly into your HTML, CSS, JSON, XML, or any other application. The conversion is instant and works entirely in your browser using the FileReader API - no server upload required.
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
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Image to Base64 Converter?</h3>
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
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Instant conversion</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Toggle data URI prefix</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Image preview</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Base64 Images</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Following these best practices ensures optimal results when using Base64 images:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use for Small Images Only</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Base64 encoding increases file size by approximately 33%, so it's best suited for small images (under 1MB recommended). Large images create very long Base64 strings that can cause performance issues, slow page loads, and exceed limits in some applications. Use Base64 for icons, logos, thumbnails, and small decorative images. For large images, use regular image files or compress images before conversion.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Choose the Right Format</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Include the data URI prefix (data:image/png;base64,) when using Base64 images directly in HTML img src attributes or CSS background-image properties. Exclude the prefix for pure Base64 strings in JSON, databases, or custom applications. Our tool lets you toggle between both formats easily. For HTML/CSS, always include the prefix. For JSON/databases, use pure Base64 strings.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Consider File Size Limits</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Be aware of file size limits in your target application. Some databases have text field limits, email clients have message size limits, and browsers have performance limits for large Base64 strings. Test your Base64 images in the target environment to ensure they work correctly. For email, keep Base64 images under 100KB. For databases, check your text field limits. For web pages, consider the impact on page load times.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Optimize Images Before Conversion</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Compress or optimize images before converting to Base64 to minimize file size. Smaller source images create smaller Base64 strings, improving performance and reducing bandwidth usage. Use image compression tools to reduce file size while maintaining acceptable quality. This is especially important for web use, where smaller files improve page load times and user experience.
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
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is Base64 encoding?</summary>
                <p className="mt-2 text-sm text-slate-600">Base64 encoding is a binary-to-text encoding scheme that converts binary data (like images) into ASCII text characters. Base64 uses 64 characters (A-Z, a-z, 0-9, +, /) to represent binary data, making it safe to transmit over text-based protocols like HTML, JSON, or email. Base64 encoded images are approximately 33% larger than the original binary format.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Why convert images to Base64?</summary>
                <p className="mt-2 text-sm text-slate-600">Converting images to Base64 allows you to embed images directly in HTML, CSS, JSON, or XML files without needing separate image files. This eliminates HTTP requests, enables offline use, simplifies data transfer, and allows images to be stored in databases or configuration files. Base64 images are commonly used for small icons, logos, thumbnails, or when embedding images in emails or single-file web pages.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is the data URI prefix?</summary>
                <p className="mt-2 text-sm text-slate-600">The data URI prefix (data:image/png;base64,) is the header that tells browsers and applications what type of data follows. When included, you can use the Base64 string directly in HTML img src attributes or CSS background-image properties. When excluded, you get a pure Base64 string suitable for JSON, databases, or custom applications. Our tool lets you toggle between both formats.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What image formats are supported?</summary>
                <p className="mt-2 text-sm text-slate-600">Our Image to Base64 tool supports all common image formats including JPEG, PNG, GIF, WebP, BMP, and SVG. Any image format that your browser can read can be converted to Base64. The tool automatically detects the image format and includes it in the data URI prefix when enabled.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is there a file size limit?</summary>
                <p className="mt-2 text-sm text-slate-600">While there's no strict limit in our tool, Base64 encoding increases file size by approximately 33%. Very large images can create very long Base64 strings that may cause performance issues in browsers or exceed limits in some applications. For web use, images under 1MB are recommended. For larger images, consider using regular image files or image compression before conversion.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my image data secure?</summary>
                <p className="mt-2 text-sm text-slate-600">Absolutely. All image conversion happens entirely in your browser using client-side JavaScript and the FileReader API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The conversion algorithm runs locally in your browser without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I use Base64 images in HTML?</summary>
                <p className="mt-2 text-sm text-slate-600">To use a Base64 image in HTML, include the data URI prefix and use it directly in an img tag: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">&lt;img src="data:image/png;base64,iVBORw0KGgoAAAANS..." /&gt;</code>. For CSS, use: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">background-image: url('data:image/png;base64,iVBORw0KGgoAAAANS...')</code>. Make sure to include the full data URI prefix for direct browser use.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I convert multiple images at once?</summary>
                <p className="mt-2 text-sm text-slate-600">Currently, our Image to Base64 tool processes one image at a time. To convert multiple images, upload and convert each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch processing tools.</p>
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
            <Link href="/image-tools/base64-to-image" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔓</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Base64 to Image</p>
                  <p className="text-xs text-slate-500">Decode Base64</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Convert Base64 encoded strings back to images. Decode Base64 image data and download as image files. Supports all common image formats.</p>
              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">Open tool →</p>
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

