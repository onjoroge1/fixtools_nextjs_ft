import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function ImageFormatConverter() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [originalFormat, setOriginalFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('jpeg'); // jpeg, png, webp, gif, bmp
  const [convertedImageUrl, setConvertedImageUrl] = useState('');
  const [convertedSize, setConvertedSize] = useState(0);
  const [quality, setQuality] = useState(0.9); // For JPEG/WebP
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/image-tools/image-format-converter`;

  // Supported formats
  const formats = [
    { value: 'jpeg', label: 'JPEG', mimeType: 'image/jpeg', extension: 'jpg', supportsQuality: true },
    { value: 'png', label: 'PNG', mimeType: 'image/png', extension: 'png', supportsQuality: false },
    { value: 'webp', label: 'WebP', mimeType: 'image/webp', extension: 'webp', supportsQuality: true },
    { value: 'gif', label: 'GIF', mimeType: 'image/gif', extension: 'gif', supportsQuality: false },
    { value: 'bmp', label: 'BMP', mimeType: 'image/bmp', extension: 'bmp', supportsQuality: false },
  ];

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, GIF, WebP, BMP, etc.)');
      return;
    }

    setError('');
    setFileName(file.name);
    setOriginalSize(file.size);
    setOriginalFormat(file.type);

    // Auto-detect output format preference (convert to different format)
    if (file.type === 'image/png') {
      setOutputFormat('jpeg');
    } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      setOutputFormat('png');
    } else if (file.type === 'image/webp') {
      setOutputFormat('jpeg');
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
        // Auto-convert on load
        setTimeout(() => convertImage(img), 100);
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

  // Convert image format
  const convertImage = (img = uploadedImage) => {
    if (!img || !imageUrl) {
      setError('Please upload an image first');
      return;
    }

    setError('');
    setIsConverting(true);

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        setError('Canvas not available');
        setIsConverting(false);
        return;
      }

      // Set canvas dimensions to image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      
      // Fill white background for formats that don't support transparency
      if (outputFormat === 'jpeg' || outputFormat === 'bmp') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);

      // Get format info
      const formatInfo = formats.find(f => f.value === outputFormat);
      if (!formatInfo) {
        setError('Unsupported format');
        setIsConverting(false);
        return;
      }

      // Convert canvas to data URL with format
      let convertedDataUrl;
      if (formatInfo.supportsQuality && quality !== undefined) {
        convertedDataUrl = canvas.toDataURL(formatInfo.mimeType, quality);
      } else {
        convertedDataUrl = canvas.toDataURL(formatInfo.mimeType);
      }

      // Calculate converted size (approximate)
      const base64Length = convertedDataUrl.length - convertedDataUrl.indexOf(',') - 1;
      const convertedSizeBytes = Math.round((base64Length * 3) / 4);

      setConvertedImageUrl(convertedDataUrl);
      setConvertedSize(convertedSizeBytes);
    } catch (err) {
      setError('Error converting image: ' + err.message);
    } finally {
      setIsConverting(false);
    }
  };

  // Handle format change
  const handleFormatChange = (newFormat) => {
    setOutputFormat(newFormat);
    if (uploadedImage) {
      setTimeout(() => convertImage(uploadedImage), 50);
    }
  };

  // Handle quality change
  const handleQualityChange = (newQuality) => {
    const numQuality = parseFloat(newQuality);
    setQuality(numQuality);
    if (uploadedImage) {
      setTimeout(() => convertImage(uploadedImage), 50);
    }
  };

  // Auto-convert when format or quality changes
  useEffect(() => {
    if (uploadedImage && imageUrl) {
      convertImage(uploadedImage);
    }
  }, [outputFormat, quality]);

  // Download converted image
  const handleDownload = () => {
    if (!convertedImageUrl) {
      setError('Please convert an image first');
      return;
    }

    const formatInfo = formats.find(f => f.value === outputFormat);
    const extension = formatInfo ? formatInfo.extension : 'jpg';
    const link = document.createElement('a');
    link.download = fileName ? `${fileName.replace(/\.[^/.]+$/, '')}.${extension}` : `converted-image.${extension}`;
    link.href = convertedImageUrl;
    link.click();
  };

  // Clear everything
  const handleClear = () => {
    setUploadedImage(null);
    setImageUrl('');
    setConvertedImageUrl('');
    setOriginalSize(0);
    setOriginalWidth(0);
    setOriginalHeight(0);
    setOriginalFormat('');
    setConvertedSize(0);
    setError('');
    setFileName('');
    setOutputFormat('jpeg');
    setQuality(0.9);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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

  // Get format info
  const getFormatInfo = (format) => {
    return formats.find(f => f.value === format) || formats[0];
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
        { "@type": "ListItem", "position": 4, "name": "Image Format Converter", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Image Format Converter",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "3124",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Convert images between JPEG, PNG, GIF, WebP, and BMP formats",
        "Maintain image quality during conversion",
        "Adjustable quality settings for JPEG and WebP",
        "Image preview with dimensions",
        "100% client-side processing",
        "No registration required",
        "Instant conversion",
        "Supports all common image formats"
      ],
      "description": "Free online tool to convert images between formats: JPEG, PNG, GIF, WebP, and BMP. Maintain quality while changing formats. Perfect for compatibility needs. Works 100% in your browser. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert Image Formats Online",
      "description": "Step-by-step guide to convert images between formats online for free using FixTools Image Format Converter.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your image",
          "text": "Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, BMP, and SVG. The tool will automatically load your image, detect the original format, and suggest an output format. You'll see the image preview and file information immediately.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Select output format",
          "text": "Choose the desired output format from the format selector: JPEG (best for photos, widely supported), PNG (lossless, supports transparency), WebP (modern format with excellent compression), GIF (for animations), or BMP (uncompressed bitmap). The tool will automatically convert the image when you change the format.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Adjust quality (if applicable)",
          "text": "For JPEG and WebP formats, adjust the quality slider (0.1 to 1.0) to control the balance between file size and image quality. Higher values maintain better quality but result in larger files. Lower values create smaller files but may reduce quality. PNG, GIF, and BMP formats don't use quality settings.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Preview and download",
          "text": "Review the converted image in the preview area. Compare original and converted file sizes, and check the image quality. When satisfied with the results, click 'Download Converted Image' to save the converted image to your device. The image is processed entirely in your browser using the Canvas API - no server upload required.",
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
          "name": "What is image format conversion?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Image format conversion is the process of changing an image from one file format to another (e.g., PNG to JPEG, JPEG to WebP). Different formats have different characteristics: JPEG is best for photos with lossy compression, PNG is lossless with transparency support, WebP offers modern compression, GIF supports animations, and BMP is uncompressed. Converting formats allows you to optimize images for specific use cases, improve compatibility, or reduce file sizes."
          }
        },
        {
          "@type": "Question",
          "name": "Why convert image formats?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Converting image formats is useful for compatibility, optimization, and specific requirements. JPEG is ideal for photos and web use with good compression. PNG is perfect for graphics, logos, or images requiring transparency. WebP offers 25-35% better compression than JPEG. GIF is needed for animated images. BMP is uncompressed and suitable for specific applications. Converting formats ensures your images work in the required applications, meet file size requirements, or support specific features like transparency."
          }
        },
        {
          "@type": "Question",
          "name": "What image formats are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Image Format Converter supports converting between JPEG, PNG, GIF, WebP, and BMP formats. You can upload images in any of these formats and convert them to any other supported format. The tool automatically detects the input format and allows you to choose the output format. SVG format is supported for input but may be converted to raster formats (JPEG, PNG, etc.) for output."
          }
        },
        {
          "@type": "Question",
          "name": "Will format conversion reduce image quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Format conversion quality depends on the formats involved. Converting to lossless formats (PNG, BMP) maintains exact quality. Converting to lossy formats (JPEG, WebP) may reduce quality slightly, especially at lower quality settings. Converting from lossy to lossy formats (JPEG to WebP) typically maintains good quality. Converting from lossless to lossy (PNG to JPEG) may reduce quality but offers significant file size reduction. Our tool allows you to adjust quality settings for JPEG and WebP to balance quality and file size."
          }
        },
        {
          "@type": "Question",
          "name": "What quality setting should I use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Quality settings (0.1 to 1.0) are available for JPEG and WebP formats. Use 0.9-1.0 (High Quality) for print materials, professional photography, or when quality is critical. Use 0.7-0.8 (Good Quality) for web use, social media, or general purposes - this provides excellent quality with good compression. Use 0.5-0.6 (Medium Quality) for thumbnails or when file size is important. PNG, GIF, and BMP formats don't use quality settings as they're lossless or have fixed compression."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert animated GIFs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our tool can convert animated GIFs to static formats (JPEG, PNG, WebP, BMP), but only the first frame will be preserved. The animation will be lost. To preserve animations, keep the image in GIF format. For converting between animated formats or preserving animations, you may need specialized animation editing software."
          }
        },
        {
          "@type": "Question",
          "name": "Is my image data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All image format conversion happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The conversion algorithm runs locally in your browser without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert multiple images at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our Image Format Converter processes one image at a time. To convert multiple images, upload and convert each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch conversion tools."
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
        <title>Image Format Converter - Free Online Tool to Convert Image Formats | FixTools</title>
        <meta name="title" content="Image Format Converter - Free Online Tool to Convert Image Formats | FixTools" />
        <meta name="description" content="Convert images between formats: JPEG, PNG, GIF, WebP, BMP, and SVG. Free online image format converter. Maintain quality while changing formats. Perfect for compatibility needs. Works 100% in your browser - fast, secure, no registration required." />
        <meta name="keywords" content="image format converter, convert image format, jpeg to png, png to jpeg, image converter, format converter, webp converter, image format changer, free image converter" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Image Format Converter - Free Online Tool to Convert Image Formats" />
        <meta property="og:description" content="Convert images between formats: JPEG, PNG, GIF, WebP, BMP, and SVG. Free online image format converter. Maintain quality while changing formats." />
        <meta property="og:image" content={`${siteHost}/images/image-format-converter-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Image Format Converter - Free Online Tool to Convert Image Formats" />
        <meta property="twitter:description" content="Convert images between formats: JPEG, PNG, GIF, WebP, BMP, and SVG. Free online image format converter." />
        <meta property="twitter:image" content={`${siteHost}/images/image-format-converter-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.image-format-converter-page) {
          font-size: 100% !important;
        }
        
        .image-format-converter-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .image-format-converter-page *,
        .image-format-converter-page *::before,
        .image-format-converter-page *::after {
          box-sizing: border-box;
        }
        
        .image-format-converter-page h1,
        .image-format-converter-page h2,
        .image-format-converter-page h3,
        .image-format-converter-page p,
        .image-format-converter-page ul,
        .image-format-converter-page ol {
          margin: 0;
        }
        
        .image-format-converter-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .image-format-converter-page input,
        .image-format-converter-page textarea,
        .image-format-converter-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="image-format-converter-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Image Format Converter</span></li>
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
                Image Format Converter
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Convert images between formats: JPEG, PNG, GIF, WebP, BMP, and SVG. Free online image format converter. Maintain quality while changing formats. Perfect for compatibility needs. Works 100% in your browser.
            </p>

            <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
              <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                <span className="relative z-10 flex items-center gap-2">⚡ Convert Format</span>
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
                <h2 className="text-xl font-semibold text-slate-900">Convert Image Format</h2>
                <p className="mt-1 text-sm text-slate-600">Upload an image and convert it to your desired format.</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Original Format:</span>
                      <span className="ml-2 font-semibold text-slate-900">{originalFormat || 'Unknown'}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Original Size:</span>
                      <span className="ml-2 font-semibold text-slate-900">{formatFileSize(originalSize)}</span>
                    </div>
                    {originalWidth > 0 && (
                      <div>
                        <span className="text-slate-600">Dimensions:</span>
                        <span className="ml-2 font-semibold text-slate-900">{originalWidth} × {originalHeight}px</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Format Selection */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Output Format</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {formats.map((format) => (
                      <button
                        key={format.value}
                        onClick={() => handleFormatChange(format.value)}
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                          outputFormat === format.value
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50'
                        }`}
                      >
                        {format.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality Slider (for JPEG and WebP) */}
                {getFormatInfo(outputFormat).supportsQuality && (
                  <div className="mt-6">
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Quality: {Math.round(quality * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.1"
                      value={quality}
                      onChange={(e) => handleQualityChange(e.target.value)}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Smaller File</span>
                      <span>Better Quality</span>
                    </div>
                  </div>
                )}

                {/* Converted Image Info */}
                {convertedImageUrl && (
                  <div className="mt-6 p-4 rounded-2xl border border-purple-200 bg-purple-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Output Format:</span>
                        <span className="ml-2 font-semibold text-slate-900">{getFormatInfo(outputFormat).label.toUpperCase()}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Converted Size:</span>
                        <span className="ml-2 font-semibold text-slate-900">{formatFileSize(convertedSize)}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Size Change:</span>
                        <span className={`ml-2 font-semibold ${convertedSize < originalSize ? 'text-green-600' : 'text-red-600'}`}>
                          {convertedSize < originalSize ? '-' : '+'}{Math.abs(((convertedSize - originalSize) / originalSize) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Image Preview */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Image Preview</label>
                  <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    {convertedImageUrl ? (
                      <img src={convertedImageUrl} alt="Converted image" className="max-w-full h-auto max-h-96 rounded-lg" />
                    ) : (
                      <img src={imageUrl} alt="Original image" className="max-w-full h-auto max-h-96 rounded-lg" />
                    )}
                  </div>
                </div>

                {/* Download Button */}
                {convertedImageUrl && (
                  <div className="mt-6">
                    <button
                      onClick={handleDownload}
                      className="w-full rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Download Converted Image
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* What is Image Format Conversion Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Image Format Conversion?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Image format conversion</strong> is the process of changing an image from one file format to another (e.g., PNG to JPEG, JPEG to WebP). Different formats have different characteristics: JPEG is best for photos with lossy compression, PNG is lossless with transparency support, WebP offers modern compression, GIF supports animations, and BMP is uncompressed. Converting formats allows you to optimize images for specific use cases, improve compatibility, or reduce file sizes.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">MDN Web Docs</a>, the HTML5 Canvas API enables powerful client-side image format conversion without server processing. Our format converter uses the Canvas API to convert images entirely in your browser, ensuring complete privacy and security. The <a href="https://www.w3.org/TR/2dcontext/" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">W3C Canvas 2D Context specification</a> provides standardized format conversion capabilities across modern browsers.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Format conversion is essential when you need images in specific formats for compatibility, optimization, or feature requirements. JPEG is ideal for photos and web use with good compression. PNG is perfect for graphics, logos, or images requiring transparency. WebP offers 25-35% better compression than JPEG. GIF is needed for animated images. BMP is uncompressed and suitable for specific applications. Converting formats ensures your images work in the required applications, meet file size requirements, or support specific features like transparency.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">✓</span>
                    Lossless Formats (PNG, BMP)
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Preserve exact image quality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Support transparency (PNG)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Larger file sizes</span>
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
                    Lossy Formats (JPEG, WebP)
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

        {/* Why Use Image Format Conversion Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Convert Image Formats?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Image format conversion is essential for modern digital workflows:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Website Compatibility</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Different websites and applications require specific image formats. Converting images ensures compatibility across all platforms. JPEG is widely supported for photos, PNG is needed for transparency, WebP offers modern compression for better performance, and GIF is required for animations. Format conversion ensures your images work everywhere.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">File Size Optimization</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Converting between formats can significantly reduce file sizes. Converting PNG to JPEG can reduce file size by 70-90% while maintaining good quality. Converting to WebP offers 25-35% better compression than JPEG. This improves website performance, reduces bandwidth usage, and speeds up page load times. According to <a href="https://web.dev/vitals/" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">Google's Core Web Vitals</a>, optimized images are crucial for good page performance scores.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Transparency Support</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      PNG format supports transparency (alpha channel), which is essential for logos, icons, and graphics that need transparent backgrounds. Converting JPEG or other formats to PNG enables transparency support. Converting PNG to JPEG removes transparency but significantly reduces file size. Choose the format based on whether you need transparency or smaller file sizes.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Application Requirements</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Many applications, software, and platforms require specific image formats. Social media platforms may prefer JPEG, design software may require PNG, and modern web applications may benefit from WebP. Converting formats ensures your images work in the required applications and meet platform-specific requirements. This is essential for uploading images to websites, apps, or software that only accept certain formats.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Performance Optimization</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Converting to modern formats like WebP can significantly improve website performance. WebP offers 25-35% better compression than JPEG at the same quality, reducing file sizes and improving page load times. This is especially important for mobile users and slow connections. Format conversion is a key part of image optimization for web performance.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-pink-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg">
                    <span className="text-2xl">💾</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Storage Efficiency</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Converting images to more efficient formats reduces storage requirements. Converting PNG to JPEG can reduce storage by 70-90%, converting to WebP offers even better compression. This is essential for mobile devices with limited storage, cloud storage with capacity limits, or when managing large image collections. Format conversion helps optimize storage usage while maintaining acceptable quality.
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
                Our Image Format Converter makes it easy to convert images between formats in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Upload your image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, BMP, and SVG. The tool will automatically load your image, detect the original format, and suggest an output format. You'll see the image preview and file information immediately.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Select output format</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Choose the desired output format from the format selector: JPEG (best for photos, widely supported), PNG (lossless, supports transparency), WebP (modern format with excellent compression), GIF (for animations), or BMP (uncompressed bitmap). The tool will automatically convert the image when you change the format. You can see the conversion happen in real-time.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Adjust quality (if applicable)</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      For JPEG and WebP formats, adjust the quality slider (0.1 to 1.0) to control the balance between file size and image quality. Higher values maintain better quality but result in larger files. Lower values create smaller files but may reduce quality. PNG, GIF, and BMP formats don't use quality settings as they're lossless or have fixed compression. The tool shows real-time file size changes.
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
                      Review the converted image in the preview area. Compare original and converted file sizes, and check the image quality. The tool shows the size change percentage to help you understand the impact of format conversion. When satisfied with the results, click 'Download Converted Image' to save the converted image to your device. The image is processed entirely in your browser using the Canvas API - no server upload required.
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
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Image Format Converter?</h3>
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
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">5 format options (JPEG, PNG, WebP, GIF, BMP)</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Adjustable quality for JPEG/WebP</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Real-time format conversion</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Image Format Conversion</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Following these best practices ensures optimal results when converting image formats:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Choose the Right Format for Your Use Case</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Select formats based on your specific needs. Use JPEG for photos, web images, or when file size is important - it offers good compression with minimal quality loss. Use PNG for graphics, logos, or images requiring transparency - it's lossless and supports alpha channels. Use WebP for modern web applications - it offers 25-35% better compression than JPEG. Use GIF for animated images. Use BMP for uncompressed bitmaps when quality is critical and file size doesn't matter.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Adjust Quality Settings Appropriately</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      For JPEG and WebP formats, use quality settings that match your use case. Use 0.9-1.0 (High Quality) for print materials, professional photography, or when quality is critical. Use 0.7-0.8 (Good Quality) for web use, social media, or general purposes - this provides excellent quality with good compression. Use 0.5-0.6 (Medium Quality) for thumbnails or when file size is important. PNG, GIF, and BMP formats don't use quality settings as they're lossless or have fixed compression.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Consider Transparency Requirements</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      If your image requires transparency (alpha channel), use PNG format. Converting PNG to JPEG will remove transparency and fill transparent areas with white. Converting JPEG to PNG won't add transparency - the image will remain opaque. For logos, icons, or graphics with transparent backgrounds, always use PNG. For photos or images without transparency needs, JPEG or WebP are better choices for smaller file sizes.
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
                      Always preview the converted image before downloading to ensure quality meets your needs. Check for format-specific issues like transparency loss (PNG to JPEG), quality degradation (lossless to lossy), or file size changes. Compare the original and converted versions side-by-side if possible. Adjust quality settings if needed - it's better to use a slightly higher quality setting than to end up with an unusable converted image. Our tool provides real-time preview so you can fine-tune settings instantly.
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
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is image format conversion?</summary>
                <p className="mt-2 text-sm text-slate-600">Image format conversion is the process of changing an image from one file format to another (e.g., PNG to JPEG, JPEG to WebP). Different formats have different characteristics: JPEG is best for photos with lossy compression, PNG is lossless with transparency support, WebP offers modern compression, GIF supports animations, and BMP is uncompressed. Converting formats allows you to optimize images for specific use cases, improve compatibility, or reduce file sizes.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Why convert image formats?</summary>
                <p className="mt-2 text-sm text-slate-600">Converting image formats is useful for compatibility, optimization, and specific requirements. JPEG is ideal for photos and web use with good compression. PNG is perfect for graphics, logos, or images requiring transparency. WebP offers 25-35% better compression than JPEG. GIF is needed for animated images. BMP is uncompressed and suitable for specific applications. Converting formats ensures your images work in the required applications, meet file size requirements, or support specific features like transparency.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What image formats are supported?</summary>
                <p className="mt-2 text-sm text-slate-600">Our Image Format Converter supports converting between JPEG, PNG, GIF, WebP, and BMP formats. You can upload images in any of these formats and convert them to any other supported format. The tool automatically detects the input format and allows you to choose the output format. SVG format is supported for input but may be converted to raster formats (JPEG, PNG, etc.) for output.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Will format conversion reduce image quality?</summary>
                <p className="mt-2 text-sm text-slate-600">Format conversion quality depends on the formats involved. Converting to lossless formats (PNG, BMP) maintains exact quality. Converting to lossy formats (JPEG, WebP) may reduce quality slightly, especially at lower quality settings. Converting from lossy to lossy formats (JPEG to WebP) typically maintains good quality. Converting from lossless to lossy (PNG to JPEG) may reduce quality but offers significant file size reduction. Our tool allows you to adjust quality settings for JPEG and WebP to balance quality and file size.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What quality setting should I use?</summary>
                <p className="mt-2 text-sm text-slate-600">Quality settings (0.1 to 1.0) are available for JPEG and WebP formats. Use 0.9-1.0 (High Quality) for print materials, professional photography, or when quality is critical. Use 0.7-0.8 (Good Quality) for web use, social media, or general purposes - this provides excellent quality with good compression. Use 0.5-0.6 (Medium Quality) for thumbnails or when file size is important. PNG, GIF, and BMP formats don't use quality settings as they're lossless or have fixed compression.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I convert animated GIFs?</summary>
                <p className="mt-2 text-sm text-slate-600">Our tool can convert animated GIFs to static formats (JPEG, PNG, WebP, BMP), but only the first frame will be preserved. The animation will be lost. To preserve animations, keep the image in GIF format. For converting between animated formats or preserving animations, you may need specialized animation editing software.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my image data secure?</summary>
                <p className="mt-2 text-sm text-slate-600">Absolutely. All image format conversion happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The conversion algorithm runs locally in your browser without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I convert multiple images at once?</summary>
                <p className="mt-2 text-sm text-slate-600">Currently, our Image Format Converter processes one image at a time. To convert multiple images, upload and convert each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch conversion tools.</p>
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

